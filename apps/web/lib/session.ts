"use server";

import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Role } from "./type";

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
  const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);

  // هنا التغيير الجذري: ننتظر الكوكيز أولاً، ثم نستخدم الدالة set
  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiredAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  // ننتظر الكوكيز أولاً، ثم نستخدم الدالة get
  const cookieStore = await cookies();
  const cookie = cookieStore.get("session")?.value;
  
  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify(cookie, encodedKey, {
      algorithms: ["HS256"],
    });

    return payload as Session;
  } catch (err) {
    console.error("Failed to verify the session", err);
    // تم تصحيح الخطأ الإملائي هنا من sigin إلى signin
    redirect("/auth/signin"); 
  }
}

export async function deleteSession() {
  // ننتظر الكوكيز أولاً، ثم نستخدم الدالة delete
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function updateTokens({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) {
  // ننتظر الكوكيز أولاً
  const cookieStore = await cookies();
  const cookie = cookieStore.get("session")?.value;
  
  if (!cookie) return null;

  const { payload } = await jwtVerify<Session>(cookie, encodedKey);

  if (!payload) throw new Error("Session not found");

  const newPayload: Session = {
    user: {
      ...payload.user,
    },
    accessToken,
    refreshToken,
  };

  await createSession(newPayload);
}