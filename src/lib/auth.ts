import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const getJwtSecret = (): Uint8Array => {
    const secret = process.env.JWT_SECRET;

    if(!secret) {
        throw new Error("JWT_SECRET is not defined in the environment variables.");
    }

    return new TextEncoder().encode(secret);
}

export interface AuthTokenPayload {
    userId: string;
}

export async function createAuthToken(
    payload: AuthTokenPayload
): Promise<string> {
    return new SignJWT({
        userId: payload.userId
    })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifyAuthToken(
    token: string
): Promise<AuthTokenPayload> {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
        algorithms: ["HS256"]
    });

    if (typeof payload.userId !== "string") {
        throw new Error("Invalid authentication token");
    }

    return {
        userId: payload.userId
    };
}

const SESSION_COOKIE_NAME = "skillbuilder_session";

export async function getAuthenticatedUserId(): Promise<string> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if(!token) {
        throw new Error("Authentication required.");
    }

    try {
        const payload = await verifyAuthToken(token);
        return payload.userId;
    } catch {
        throw new Error("Invalid or expired session.");
    }
}

export { SESSION_COOKIE_NAME };