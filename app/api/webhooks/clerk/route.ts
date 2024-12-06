import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('Missing WEBHOOK_SECRET in environment variables.');
    return new Response('Server configuration error', { status: 500 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Missing Svix headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const webhook = new Webhook(WEBHOOK_SECRET);
  let event: WebhookEvent;

  try {
    event = webhook.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch (error) {
    console.error('Error verifying webhook:', error);
    return new Response('Invalid webhook signature', { status: 400 });
  }

  const { type: eventType } = event;

  try {
    if (eventType === 'user.created') {
      const { id, email_addresses, first_name, last_name } = event.data;
      const email = email_addresses?.[0]?.email_address;
      const name = `${first_name || ''} ${last_name || ''}`.trim();

      if (!email) {
        console.error('Missing email in user.created event');
        return new Response('Invalid payload', { status: 400 });
      }

      await prisma.user.create({
        data: {
          clerkId: id,
          email,
          name,
          department: 'Unassigned', // Default value
          role: 'EMPLOYEE', // Default role
        },
      });

      console.log('User created successfully:', { id, email, name });
      return NextResponse.json({ message: 'User created' });
    } else if (eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name } = event.data;
      const email = email_addresses?.[0]?.email_address;
      const name = `${first_name || ''} ${last_name || ''}`.trim();

      if (!email) {
        // console.error('Missing email in user.updated event');
        return new Response('Invalid payload', { status: 400 });
      }

      await prisma.user.update({
        where: { clerkId: id },
        data: { email, name },
      });

      // console.log('User updated successfully:', { id, email, name });
      return NextResponse.json({ message: 'User updated' });
    }else {
      // console.warn('Unhandled event type:', eventType);
      return NextResponse.json({ message: 'Unhandled event type' }, { status: 400 });
    }
  } catch (error) {
    // console.error('Error processing event:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(message, { status: 500 });
  }
}
