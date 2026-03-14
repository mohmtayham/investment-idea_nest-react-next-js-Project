"use server"
import { jwtVerify, SignJWT } from "jose";
import { cookies as nextCookies } from "next/headers";
import { redirect as nextRedirect } from "next/navigation";
import { Role } from "./type"; // Assuming type.ts exists and defines Role

export type Session = {
  user: {
    id: string;
    name: string;
    role: Role;
  };
  accessToken: string;
  refreshToken: string;
};

const secretKey = process.env.SESSION_SECRET_KEY!;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(payload: Session) {
  console.log("--- [Session: createSession] Initiated session creation ---");
  try {
    const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    console.log(`--- [Session: createSession] Session will expire at: ${expiredAt.toISOString()} ---`);

    const session = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(encodedKey);
    console.log("--- [Session: createSession] JWT signed successfully ---");

    const cookieStore = await nextCookies();
    cookieStore.set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: expiredAt,
      sameSite: "lax",
      path: "/",
    });
    console.log("--- [Session: createSession] ✅ Session cookie set successfully ---");
  } catch (error) {
    console.error(`--- [Session: createSession] 🔥 Error creating session: ${error instanceof Error ? error.message : String(error)}`);
    console.error(error);
    throw new Error("Failed to create user session.");
  }
}

export async function getSession() {
  console.log("--- [Session: getSession] Attempting to retrieve session ---");
  try {
    const cookieStore = await nextCookies();
    const cookie = cookieStore.get("session")?.value;

    if (!cookie) {
      console.log("--- [Session: getSession] No session cookie found. Returning null. ---");
      return null;
    }
    console.log("--- [Session: getSession] Session cookie found. Verifying JWT ---");

    const { payload } = await jwtVerify(cookie, encodedKey, {
      algorithms: ["HS256"],
    });
    console.log("--- [Session: getSession] ✅ Session retrieved and verified. Payload:", payload);
    return payload as Session;
  } catch (err) {
    console.error(`--- [Session: getSession] 🔥 Failed to verify the session: ${err instanceof Error ? err.message : String(err)}`);
    console.error(err);
    // Redirect to signin only if it's a verification error, not just missing cookie
    if (err instanceof Error && err.name === 'JWSSignatureVerificationFailed') {
      console.log("--- [Session: getSession] JWT verification failed. Redirecting to /auth/signin ---");
      nextRedirect("/auth/signin");
    }
    return null; // Return null if session is invalid or missing
  }
}

export async function deleteSession() {
  console.log("--- [Session: deleteSession] Deleting session cookie ---");
  try {
    const cookieStore = await nextCookies();
    cookieStore.delete("session");
    console.log("--- [Session: deleteSession] ✅ Session cookie deleted ---");
  } catch (error) {
    console.error(`--- [Session: deleteSession] 🔥 Error deleting session: ${error instanceof Error ? error.message : String(error)}`);
    console.error(error);
    throw new Error("Failed to delete user session.");
  }
}

export async function updateTokens({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) {
  console.log("--- [Session: updateTokens] Initiated token update ---");
  try {
    const cookieStore = await nextCookies();
    const cookie = cookieStore.get("session")?.value;

    if (!cookie) {
      console.warn("--- [Session: updateTokens] ⚠️ No existing session cookie to update. Returning null. ---");
      return null;
    }
    console.log("--- [Session: updateTokens] Existing session cookie found. Verifying JWT for update ---");

    const { payload } = await jwtVerify<Session>(cookie, encodedKey);

    if (!payload) {
      console.error("--- [Session: updateTokens] ❌ Existing session payload not found or invalid. Throwing error. ---");
      throw new Error("Session not found or invalid during token update.");
    }
    console.log("--- [Session: updateTokens] Original session payload:", payload);

    const newPayload: Session = {
      user: {
        ...payload.user,
      },
      accessToken,
      refreshToken,
    };
    console.log("--- [Session: updateTokens] New session payload created:", newPayload);

    await createSession(newPayload);
    console.log("--- [Session: updateTokens] ✅ Session tokens updated successfully ---");
  } catch (error) {
    console.error(`--- [Session: updateTokens] 🔥 Error updating tokens: ${error instanceof Error ? error.message : String(error)}`);
    console.error(error);
    throw new Error("Failed to update session tokens.");
  }
}
