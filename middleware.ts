import { NextResponse, NextRequest} from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error("SECRET_KEY is not defined in the environment variables.");
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
  
    // Allow access to public routes like login and register
    if (pathname.startsWith('/auth')) {
      return NextResponse.next();
    }
  
    // Get the token from the cookies
    const token = request.cookies.get('access_token');
  
    if (!token) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  
    if (pathname.startsWith('/auth') && token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    
    try {
        
    const secretKey = new TextEncoder().encode(SECRET_KEY);

        const tokenValue = token.value.replace('Bearer ', '');


      // Verify the token using jose
      
      const { payload } = await jwtVerify(tokenValue, secretKey);
  
      console.log(payload);
  
      // Proceed to the requested route if the token is valid
      return NextResponse.next();

    } catch (err) {
      console.log(err);
  
      // Redirect to login page if the token is invalid or expired
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }


export const config = {
    matcher: ['/dashboard/:path*'], // Apply to protected routes
};





