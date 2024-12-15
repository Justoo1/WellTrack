import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server';
// import { deleteUser } from './lib/actions/users.action';

// Define public routes to exclude from middleware checks
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/api/webhooks(.*)',
  '/wrong-email',
  '/api/users',
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    const { userId } = await auth();

    // Protect private routes
    if (!userId) {
      await auth.protect();
      return;
    }

    try {
      // Fetch user details from Clerk
      const client = await clerkClient();
      const user = await client.users.getUser(userId).catch((err) => {
        if (err.status === 404) {
          console.warn(`User not found: ${userId}`);
          return null; // Skip deletion if user doesn't exist
        }
        throw err;
      });

      if (!user) {
        // Redirect the user to an error page or sign-in page
        const errorRedirect = new URL('/wrong-email', request.url);
        return new Response(null, { status: 307, headers: { Location: errorRedirect.toString() } });
      }
      const email = user.emailAddresses[0]?.emailAddress || '';
      const allowedDomain = 'devopsafricalimited.com';

      // Check if the email domain is invalid
      if (!email.endsWith(`@${allowedDomain}`)) {
        // Delete the user from Clerk
        await client.users.deleteUser(userId).catch((err) => {
          if (err.status !== 404) throw err; // Ignore 404, handle others
        });

        // Delete the user from PostgreSQL
        const deleteUrl = new URL('/api/delete-user', request.url);
        deleteUrl.searchParams.set('userId', userId);

        return new Response(null, {
          status: 307,
          headers: { Location: deleteUrl.toString() },
        });

        // Redirect the user to an error page or sign-in page
        const errorRedirect = new URL('/sign-in?error=invalid-email', request.url);
        return new Response(null, { status: 307, headers: { Location: errorRedirect.toString() } });
      }
    } catch (error) {
      console.error('Error in middleware:', error);

      // Optionally redirect to a generic error page
      const errorRedirect = new URL('/wrong-email', request.url);
      return new Response(null, { status: 307, headers: { Location: errorRedirect.toString() } });
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
