import { NextRequest, NextResponse} from "next/server";

const SESSION_COOKIE_NAME = "skillbuilder_session";

const protectedRoutes = [
    "/dashboard",
    "/onboarding",
    "/roadmap",
    "/mentor",
    "/projects",
    "/resume",
    "/profile"
];

const authRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password"
];

export function proxy(request: NextRequest){
    const { pathname } = request.nextUrl;

    const sessionToken = request.cookies.get(
        SESSION_COOKIE_NAME
    )?.value;

    const isProtectedRoute = protectedRoutes.some(
        (route) =>
            pathname === route  ||
            pathname.startsWith(`${route}/`)
    );

    const isAuthRoute = authRoutes.some(
        (route) => pathname === route
    );

    if (isProtectedRoute && !sessionToken){
        const loginUrl = new URL("/login", request.url);

        loginUrl.searchParams.set(
            "redirect",
            pathname
        );

        return NextResponse.redirect(loginUrl);
    }

    if (isAuthRoute && sessionToken) {
        return NextResponse.redirect(
            new URL("/dashboard", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
        * Skip API routes, Next.js assets, images and files
        * containing an extension such as favicon.ico.
        */
        "/((?!api|_next/static|_next/image|.*\\..*).*)",
    ],
};