"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Lottie from 'lottie-react';
import Newideajson from '@/assets/animations/New idea.json';
import { Plus } from 'lucide-react';

// المكونات الأخرى تظل كما هي
import ProfileSidebar from '@/components/profile/profileSidebar';
import IdeasList from '@/components/profile/ideaList';

export default function ProfileContent({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [profileData, setProfileData] = useState(initialData.profile);
  const [ideas] = useState(initialData.ideas);
const [isUpdating, setIsUpdating] = useState(false);
  // منطق التحديث يظل في الـ Client-side
  const handleUpdateProfile = async (updatedData:FormData)=> {
    setIsUpdating(true);
    try {
    // استخدم profileService هنا لإرسال البيانات
    // await profileService.updateProfile(updatedData);
  } catch (error) {
    console.error("Failed to update profile", error);
  } finally {
    setIsUpdating(false); // إيقاف حالة التحميل مهما كانت النتيجة
  }
    // استخدم profileService هنا
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <ProfileSidebar profile={profileData} onEditProfile={handleUpdateProfile} updating={isUpdating} />
          
          <div className="lg:w-2/3">
            {/* بقية كود الـ JSX الخاص بك */}
            <div 
              onClick={() => router.push('/submit-idea')} 
              className="cursor-pointer bg-blue-50 p-6 rounded-2xl"
            >
              <Plus className="w-8 h-8 text-blue-600" />
              <h3>Start New Idea</h3>
            </div>
            <IdeasList ideas={ideas} />
          </div>
        </div>
      </div>
    </div>
  );
}