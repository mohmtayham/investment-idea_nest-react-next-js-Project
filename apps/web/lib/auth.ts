"use server";

import { redirect } from "next/navigation";
import { getSession } from "./session";

import { BACKEND_URL } from "./constant";
import {
  FormState,
  LoginFormSchema,
  SignupFormSchema,
} from "./type";
import { createSession, updateTokens } from "./session";
import { cookies } from "next/dist/server/request/cookies";
export async function signOut() {
  console.log("--- [Frontend: SignOut Triggered] ---");

  try {
    const cookieStore = await cookies();
    
    // الحل هنا: تخزين نتيجة الدالة في متغير باسم session
    const session = await getSession(); 

    // الآن يمكنك استخدام session.accessToken بأمان
    if (session && session.accessToken) {
      const response = await fetch(`${BACKEND_URL}/auth/signout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session.accessToken}`, 
          "Content-Type": "application/json"
        }
      });
      console.log("📡 Backend Revoke Response Status:", response.status);
    }

    cookieStore.delete("session");
    console.log("✅ Local cookie deleted");
  } catch (error) {
    console.error("🔥 SignOut Error:", error);
  }

  redirect("/auth/signin");
}
export async function signUp(state: FormState, formData: FormData): Promise<FormState> {
  console.log('--- [Frontend Action Started] ---');
  let isSuccessful = false; // <--- أضف هذا السطر هنا
  
  try {
    const validationFields = SignupFormSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!validationFields.success) {
      console.warn('⚠️ Validation Failed:', validationFields.error.flatten().fieldErrors);
      return { error: validationFields.error.flatten().fieldErrors };
    }

    console.log('Calling Backend:', `${BACKEND_URL}/auth/signup`);
    
    const response = await fetch(`${BACKEND_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validationFields.data),
    });

    console.log('Backend Status Code:', response.status);
    console.log('Backend Status Text:', response.statusText);

  if (response.ok) {
      console.log('🚀 Registration success!');
      isSuccessful = true; // نضع علامة النجاح هنا
    } else {
      const errorData = await response.json().catch(() => ({}));
      return {
        message: response.status === 409 ? "User exists!" : errorData.message,
      };
    }
  } catch (error) {
    // نتأكد أننا لا نلتقط خطأ الـ redirect هنا
    console.error('🔥 Error:', error);
    return { message: "Something went wrong" };
  }

  // نستدعي الـ redirect هنا خارج الـ try/catch
  if (isSuccessful) {
    redirect("/auth/signin");
  }
}

export async function signIn(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      message: "Validation Error", // تأكد أن FormState لديك يحتوي على حقل message
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await fetch(`${BACKEND_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedFields.data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        message: response.status === 401 ? "Invalid Credentials!" : (errorData.message || "Login failed"),
      };
    }

    const result = await response.json();
    
    // تأكد أن createSession لا ترفع خطأً غير متوقع
    await createSession({
      user: {
        id: result.id,
        name: result.name,
        role: result.role,
      },
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });

    // الـ redirect يجب أن تكون خارج الـ try/catch لتجنب التقاطها
  } catch (error) {
    console.error('🔥 SignIn Action Error:', error);
    return { message: "Server unreachable or connection error." };
  }

  // التوجيه الناجح
  redirect("/heroSection");
}

export const refreshToken = async (
  oldRefreshToken: string
) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: oldRefreshToken,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to refresh token" + response.statusText
      );
    }

    const { accessToken, refreshToken } =
      await response.json();
    // update session with new tokens
    const updateRes = await fetch(
      "http://localhost:3000/api/auth/update",
      {
        method: "POST",
        body: JSON.stringify({
          accessToken,
          refreshToken,
        }),
      }
    );
    if (!updateRes.ok)
      throw new Error("Failed to update the tokens");

    return accessToken;
  } catch (err) {
    console.error("Refresh Token failed:", err);
    return null;
  }
};
