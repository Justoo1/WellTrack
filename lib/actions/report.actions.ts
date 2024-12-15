"use server";

import prisma from "../prisma"

// export async function getFinancialSummary(startDate: Date, endDate: Date) {
//   const testcontributions = await prisma.contribution.findMany({
//     where: {
//       status: 'COMPLETED',
//     },
//     select: {
//       month: true,
//       year: true,
//       amount: true,
//     },
//   });
  
//   console.log("testcontributions", testcontributions);
//     const contributions = await prisma.contribution.groupBy({
//       by: ['year', 'month'],
//       _sum: {
//         amount: true,
//       },
//       where: {
//         month: {
//           gte: startDate,
//           lte: endDate,
//         },
//         status: 'COMPLETED', // Only consider approved contributions
//       },
//       orderBy: [
//         { year: 'asc' },
//         { month: 'asc' },
//       ],
//     })

//     console.log("contributions", contributions)
  
//     const expenses = await prisma.expense.groupBy({
//       by: ['date'],
//       _sum: {
//         amount: true,
//       },
//       where: {
//         date: {
//           gte: startDate,
//           lte: endDate,
//         },
//         status: 'APPROVED', // Only consider approved expenses
//       },
//       orderBy: {
//         date: 'asc',
//       },
//     })
  
//     const events = await prisma.event.groupBy({
//       by: ['type', 'year', 'month'],
//       _count: {
//         id: true,
//       },
//       where: {
//         start: {
//           gte: startDate,
//           lte: endDate,
//         },
//         status: 'ACTIVE', // Only consider active events
//       },
//       orderBy: [
//         { year: 'asc' },
//         { month: 'asc' },
//       ],
//     })
  
//     const totalContribution = await prisma.contribution.aggregate({
//       _sum: {
//         amount: true,
//       },
//       where: {
//         month: {
//           gte: startDate,
//           lte: endDate,
//         },
//         status: 'COMPLETED',
//       },
//     })
  
//     const totalExpenses = await prisma.expense.aggregate({
//       _sum: {
//         amount: true,
//       },
//       where: {
//         date: {
//           gte: startDate,
//           lte: endDate,
//         },
//         status: 'APPROVED',
//       },
//     })
  
//     return {
//       contributions: contributions.map(c => ({
//         ...c,
//         _sum: { amount: c._sum.amount ?? 0 }
//       })),
//       expenses: expenses.map(e => ({
//         ...e,
//         _sum: { amount: e._sum.amount ?? 0 }
//       })),
//       events,
//       totalContribution: totalContribution._sum.amount ?? 0,
//       totalExpenses: totalExpenses._sum.amount ?? 0,
//     }
// }

type ContributionGroup = {
  [key: string]: {
    year: number;
    month: number;
    total: number;
  };
};

export async function getFinancialSummary(startDate: Date, endDate: Date) {
  // Normalize startDate and endDate to the start and end of their respective months
  const startOfMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const endOfMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);

  // Fetch raw contributions data
  const rawContributions = await prisma.contribution.findMany({
    where: {
      month: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
      status: 'COMPLETED', // Only consider completed contributions
    },
    select: {
      month: true,
      year: true,
      amount: true,
    },
  });

  // Group contributions by year and month
  const groupedContributions: ContributionGroup = rawContributions.reduce((acc: ContributionGroup, curr) => {
    const key = `${curr.year}-${new Date(curr.month).getMonth() + 1}`;
    if (!acc[key]) {
      acc[key] = { year: curr.year, month: new Date(curr.month).getMonth() + 1, total: 0 };
    }
    acc[key].total += curr.amount;
    return acc;
  }, {});

  const contributions = Object.values(groupedContributions);

  // Fetch expenses data
  const expenses = await prisma.expense.groupBy({
    by: ['date'],
    _sum: { amount: true },
    where: {
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
      status: 'APPROVED', // Only consider approved expenses
    },
    orderBy: { date: 'asc' },
  });

  // Fetch events data
  const events = await prisma.event.groupBy({
    by: ['type', 'year', 'month'],
    _count: { id: true },
    where: {
      start: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
      status: 'ACTIVE', // Only consider active events
    },
    orderBy: [
      { year: 'asc' },
      { month: 'asc' },
    ],
  });

  // Fetch total contributions
  const totalContribution = await prisma.contribution.aggregate({
    _sum: { amount: true },
    where: {
      month: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
      status: 'COMPLETED',
    },
  });

  // Fetch total expenses
  const totalExpenses = await prisma.expense.aggregate({
    _sum: { amount: true },
    where: {
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
      status: 'APPROVED',
    },
  });

  // Return the financial summary
  return {
    contributions: contributions.map(c => ({
      year: c.year,
      month: c.month,
      _sum: { amount: c.total ?? 0 },
    })),
    expenses: expenses.map(e => ({
      date: e.date,
      _sum: { amount: e._sum.amount ?? 0 },
    })),
    events,
    totalContribution: totalContribution._sum.amount ?? 0,
    totalExpenses: totalExpenses._sum.amount ?? 0,
  };
}
