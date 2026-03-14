"use server";

import { redirect } from 'next/navigation';
import profileService from '@/services/profileService';
import ProfileContent from './profileContent'; // تأكد من وجود هذا الملف ومساره الصحيح

async function getProfileData() {
  console.log("--- [Server Component: ProfilePage] getProfileData: Attempting to fetch profile and ideas. ---");
  try {
    // جلب بيانات البروفايل
    console.log("--- [Server Component: ProfilePage] getProfileData: Calling profileService.getProfile(). ---");
    const profileResponse = await profileService.getProfile();
    console.log("--- [Server Component: ProfilePage] getProfileData: Received profileResponse. ---");
    
    // جلب الأفكار مع معالجة الخطأ بشكل منفصل
    console.log("--- [Server Component: ProfilePage] getProfileData: Calling profileService.getMyIdeas(). ---");
    const ideasResponse = await profileService.getMyIdeas().catch((err) => {
      console.error("--- [Server Component: ProfilePage] getProfileData: ❌ Ideas fetch failed:", err);
      return []; 
    });
    console.log("--- [Server Component: ProfilePage] getProfileData: Received ideasResponse. ---");

    // معالجة شكل البيانات القادمة من الباك إند
    const ideas = Array.isArray(ideasResponse) 
      ? ideasResponse 
      : (ideasResponse?.ideas || []);
    console.log(`--- [Server Component: ProfilePage] getProfileData: Processed ideas. Count: ${ideas.length} ---`);

    return {
      profile: profileResponse,
      ideas: ideas,
    };
  } catch (error: any) {
    console.error("--- [Server Component: ProfilePage] getProfileData: 🔥 Profile Data Fetch Error:", error.message);
    console.error(error); // سجل الكائن الخطأ بالكامل لمزيد من التفاصيل

    // إذا كان الخطأ متعلق بالتوكن (Failed to refresh token) 
    // أو إذا كان الرد 401 (غير مصرح)، نقوم بإرجاع null لتوجيه المستخدم
    if (error.message?.includes("refresh token") || error.status === 401) {
      console.log("--- [Server Component: ProfilePage] getProfileData: Authentication error detected. Returning null. ---");
      return null;
    }

    // لأي أخطاء أخرى، نلقي الخطأ ليظهر في error boundary
    console.error("--- [Server Component: ProfilePage] getProfileData: Re-throwing generic error for error boundary. ---");
    throw new Error("Failed to load profile data");
  }
}

export default async function ProfilePage() {
  console.log("--- [Server Component: ProfilePage] Rendering ProfilePage. ---");
  const data = await getProfileData();
  console.log(`--- [Server Component: ProfilePage] getProfileData returned: ${data ? "data" : "null"} ---`);

  // إذا فشل التوثيق (null)، يتم التوجيه لصفحة تسجيل الدخول فوراً
  if (!data) {
    console.log("--- [Server Component: ProfilePage] No data received, redirecting to /auth/signin. ---");
    redirect("/auth/signin");
  }

  console.log("--- [Server Component: ProfilePage] Rendering ProfileContent with initialData. ---");
  return <ProfileContent initialData={data} />;
}
