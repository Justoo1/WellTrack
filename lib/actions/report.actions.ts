"use server";

import prisma from "../prisma"

export async function getFinancialSummary(startDate: Date, endDate: Date) {
    const contributions = await prisma.contribution.groupBy({
      by: ['year', 'month'],
      _sum: {
        amount: true,
      },
      where: {
        month: {
          gte: startDate,
          lte: endDate,
        },
        status: 'COMPLETED', // Only consider approved contributions
      },
      orderBy: [
        { year: 'asc' },
        { month: 'asc' },
      ],
    })
  
    const expenses = await prisma.expense.groupBy({
      by: ['date'],
      _sum: {
        amount: true,
      },
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        status: 'APPROVED', // Only consider approved expenses
      },
      orderBy: {
        date: 'asc',
      },
    })
  
    const events = await prisma.event.groupBy({
      by: ['type', 'year', 'month'],
      _count: {
        id: true,
      },
      where: {
        start: {
          gte: startDate,
          lte: endDate,
        },
        status: 'ACTIVE', // Only consider active events
      },
      orderBy: [
        { year: 'asc' },
        { month: 'asc' },
      ],
    })
  
    const totalContribution = await prisma.contribution.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        month: {
          gte: startDate,
          lte: endDate,
        },
        status: 'COMPLETED',
      },
    })
  
    const totalExpenses = await prisma.expense.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        status: 'APPROVED',
      },
    })
  
    return {
      contributions: contributions.map(c => ({
        ...c,
        _sum: { amount: c._sum.amount ?? 0 }
      })),
      expenses: expenses.map(e => ({
        ...e,
        _sum: { amount: e._sum.amount ?? 0 }
      })),
      events,
      totalContribution: totalContribution._sum.amount ?? 0,
      totalExpenses: totalExpenses._sum.amount ?? 0,
    }
}
  