import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error("SECRET_KEY is not defined in the environment variables.");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get tokens from cookies
  const accessToken = request.cookies.get('access_token');
  const refreshToken = request.cookies.get('refresh_token');

  // Redirect logged-in users away from auth pages
  if (pathname.startsWith('/auth')) {
    if (accessToken) {
      try {
        // Validate access token
        const tokenValue = sanitizeToken(accessToken.value);
        const { payload } = await jwtVerify(tokenValue, new TextEncoder().encode(SECRET_KEY));
        // console.log('Access Token Payload:', payload);

        // Redirect to dashboard if the user is already logged in
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } catch (err) {
        console.error('Token validation error on /auth page:', err);
        // Fall through to allow access to auth page if token is invalid
      }
    }
    return NextResponse.next(); // Allow access to /auth if not logged in
  }

  // Protect other routes
  if (pathname.startsWith('/dashboard')) {
    // Redirect to login if no tokens are present
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    try {
      // Validate access token
      if (accessToken) {
        const tokenValue = sanitizeToken(accessToken.value);
        const { payload } = await jwtVerify(tokenValue, new TextEncoder().encode(SECRET_KEY));
        console.log('Access Token Payload:', payload);

        // Proceed to the requested route if the token is valid
        return NextResponse.next();
      }

      // If the access token is invalid and refresh token exists
      if (refreshToken) {
        console.log('Access token expired, relying on refresh token.');

        // Redirect user to a client-side refresh flow
        const url = new URL('/auth', request.url);
        url.searchParams.set('redirect', request.nextUrl.pathname); // Pass the intended destination
        return NextResponse.redirect(url);
      }
    } catch (err) {
      console.error('Token validation error:', err);

      // Redirect to login if tokens fail validation
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }

  return NextResponse.next(); // Allow all other requests
}

/**
 * Sanitize token by removing the 'Bearer' prefix, quotes, and extra spaces.
 */
function sanitizeToken(token: string): string {
  return token.replace('Bearer ', '').replace(/"/g, '').trim();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'], // Apply to protected routes
};
