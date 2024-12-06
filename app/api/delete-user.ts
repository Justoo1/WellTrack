// import { clerkClient } from '@clerk/nextjs';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.query;
  const userIdValue = Array.isArray(userId) ? userId[0] : userId;

  if (!userIdValue) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // // Delete from Clerk
    // await clerkClient.users.deleteUser(userId).catch((err) => {
    //   if (err.status !== 404) throw err;
    // });

    // Delete from PostgreSQL
    await prisma.user.delete({
      where: { clerkId: userIdValue },
    }).catch((err) => {
      console.error(`Error deleting user from DB: ${userId}`, err);
    });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error in API route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
