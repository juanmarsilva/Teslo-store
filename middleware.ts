import { NextResponse, NextRequest } from 'next/server'
 
import * as jose from 'jose';
import { getToken } from 'next-auth/jwt';
 

/**
 * This TypeScript function is a middleware that checks if a session exists and redirects to a login
 * page if not.
 * @param {NextRequest} req - The `req` parameter is the request object that contains information about
 * the incoming HTTP request. It includes properties such as the request method, headers, URL, and
 * query parameters. It is used to extract information from the request and perform operations based on
 * that information.
 * @returns The code is returning a NextResponse object. If the session is not found, it redirects to
 * the login page with the requested page as a query parameter. If the session is found, it allows the
 * request to proceed to the next middleware or route handler.
 */
export async function middleware(req: NextRequest) {

    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if( !session ) {
        const requestedPage = req.nextUrl.pathname;
        const url = req.nextUrl.clone();
        url.pathname = '/auth/login'
        url.search = `fromPage=${requestedPage}`;

        return NextResponse.redirect( url );
    }
            
    return NextResponse.next();
};
 
/* The `export const config` block is defining the configuration for the middleware. In this case, it
specifies the `matcher` property, which is an array of URL paths that the middleware should be
applied to. The middleware will only be executed for requests that match these paths, specifically
`/checkout/address` and `/checkout/summary`. */
export const config = {
    matcher: [
        '/checkout/address',
        '/checkout/summary',
    ],
};