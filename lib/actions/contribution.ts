// app/actions/contribution.ts
"use server"

import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { Contribution, ContributionCreateSchema, ExpenseSchema } from '../validation'


export async function createContribution(values: Contribution) {
  const { userId: adminId } = await auth()
  
  if (!adminId) {
    return { error: 'Unauthorized' }
  }

  try {

    const validatedData = ContributionCreateSchema.parse(values)

    const existingContribution = await prisma.contribution.findFirst({
      where: {
        userId: validatedData.userId,
        month: validatedData.month,
        year: validatedData.year,
        quarter: validatedData.quarter
      }
    })

    if (existingContribution) {
      return { error: 'Contribution already exists' }
    }

    const contribution = await prisma.contribution.create({
      data: {
        ...validatedData,
        createdAt: new Date()
      }
    })

    revalidatePath('/admin/contributions')

    return { success: true, contribution }
  } catch (error) {
    console.error('Contribution creation error:', error)
    return { error: 'Failed to create contribution' }
  }
}

export async function deleteContribution(contributionId: string) {
  try {
    await prisma.contribution.delete({ where: { id: contributionId } })
    revalidatePath('/admin/contribution')
    return { success: true }
  } catch (error) {
    console.error('Contribution deletion error:', error)
    return { error: 'Failed to delete contribution' }
  }
}

export async function updateContribution(contributionId: string, values: Contribution) {
  try {
    const contribution = await prisma.contribution.update({
      where: { id: contributionId },
      data: values
    })
    revalidatePath('/admin/contribution')
    return { success: true, contribution }
  } catch (error) {
    console.error('Contribution update error:', error)
    return { error: 'Failed to update contribution' }
  }
}

export async function fetchContributions() {
  try {
    const contributions = await prisma.contribution.findMany({
      include: {
        user: true
      },
      orderBy:{
        month: "desc"
      }
    })
    const totalContributions = contributions.reduce((sum, contribution) => sum + contribution.amount, 0)
    
    // Calculate the percentage change from last month
    const lastMonthStart = new Date()
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1)
    lastMonthStart.setDate(1)
    
    const lastMonthContributions = await prisma.contribution.findMany({
      where: {
        month: {
          gte: lastMonthStart,
          lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    })
    
    const lastMonthTotal = lastMonthContributions.reduce((sum, contribution) => sum + contribution.amount, 0)
    const percentageChange = lastMonthTotal ? ((totalContributions - lastMonthTotal) / lastMonthTotal) * 100 : 0

    return { 
      success: true, 
      contributions,
      totalContributions,
      percentageChange: percentageChange.toFixed(1)
    }
  } catch (error) {
    console.error('Contribution fetch error:', error)
    return { error: 'Failed to fetch contributions' }
  }
}


export async function fetchContribution(contributionId: string) {
  try {
    const contribution = await prisma.contribution.findUnique({ where: { id: contributionId } })
    return { success: true, contribution }
  } catch (error) {
    console.error('Contribution fetch error:', error)
    return { error: 'Failed to fetch contribution' }
  }
}


// Define the response structure
// interface AnalyticsResponse {
//   success: boolean;
//   monthlyContributions: { month: string; amount: number }[];
//   incomeVsExpenses: { month: string; income: number; expenses: number }[];
//   error?: string;
// }

export async function IncomeVsExpense(): Promise<{
  success: boolean;
  monthlyContributions: Array<{ month: string; year: number; amount: number }>;
  incomeVsExpenses: Array<{ month: string; year: number; income: number; expenses: number }>;
  error?: string;
}> {
  try {
    // Fetch contributions and expenses from the database
    const contributions: Contribution[] = await prisma.contribution.findMany();
    const rawExpenses = await prisma.expense.findMany();
    
    const expenses = rawExpenses.map((expense) => ExpenseSchema.parse({
      ...expense,
      description: expense.description ?? undefined, // Ensure compatibility
    }));

    // Initialize objects to accumulate totals
    const contributionTotals: Record<string, { amount: number; year: number }> = {};
    const expenseTotals: Record<string, { amount: number; year: number }> = {};

    // Group contributions by month and year, sum the amounts
    contributions.forEach(({ month: date, amount }) => {
      const monthDate = new Date(date);
      const month = monthDate.toLocaleString('default', { month: 'short' });
      const year = monthDate.getFullYear();
      const key = `${month}-${year}`;

      contributionTotals[key] = {
        amount: (contributionTotals[key]?.amount || 0) + amount,
        year
      };
    });

    // Group expenses by month and year, sum the amounts
    expenses.forEach(({ date, amount }) => {
      const monthDate = new Date(date);
      const month = monthDate.toLocaleString('default', { month: 'short' });
      const year = monthDate.getFullYear();
      const key = `${month}-${year}`;

      expenseTotals[key] = {
        amount: (expenseTotals[key]?.amount || 0) + amount,
        year
      };
    });

    // Generate analytics arrays
    const monthlyContributions = Object.entries(contributionTotals).map(
      ([key, { amount, year }]) => {
        const [month] = key.split('-');
        return { month, year, amount };
      }
    );

    // Combine keys from contributions and expenses
    const allKeys = new Set([
      ...Object.keys(contributionTotals),
      ...Object.keys(expenseTotals),
    ]);

    const incomeVsExpenses = Array.from(allKeys).map((key) => {
      const [month, year] = key.split('-');
      return {
        month,
        year: parseInt(year),
        income: contributionTotals[key]?.amount || 0,
        expenses: expenseTotals[key]?.amount || 0,
      };
    });

    return { 
      success: true, 
      monthlyContributions, 
      incomeVsExpenses 
    };
  } catch (error) {
    console.error('Contribution fetch error:', error);
    return { 
      success: false, 
      error: 'Failed to fetch data', 
      monthlyContributions: [], 
      incomeVsExpenses: [] 
    };
  }
}
