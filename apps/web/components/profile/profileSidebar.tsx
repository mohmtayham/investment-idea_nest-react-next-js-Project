"use client";

import Image from "next/image";
import { Mail, Phone, Edit, Camera, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// استخدام متغيرات البيئة بدلاً من الهارد كود
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const ProfileSidebar = ({ profile, onEditProfile, updating }: { profile: any; onEditProfile: any; updating: boolean }) => {
  const ideaOwner = profile?.profile || {};
  const name = profile?.name || "User";
  const email = profile?.email || "";

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    phone: "",
    bio: "",
    profile_image: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState("");
  const avatar = imagePreview || "/default-avatar.png";

  const fileInputRef = useRef<HTMLInputElement>(null);

  // دالة الصور الافتراضية
  const getDefaultAvatar = (userName: string) => {
    const initials = userName ? userName.charAt(0).toUpperCase() : "U";
    return `https://ui-avatars.com/api/?name=${initials}&background=3b82f6&color=fff&size=150`;
  };

  // مزامنة البيانات عند تغير الـ Props
  useEffect(() => {
    setEditData({
      phone: ideaOwner.phone || "",
      bio: ideaOwner.bio || "",
      profile_image: null,
    });

    const fullImageUrl = ideaOwner.profile_image 
      ? `${API_URL}${ideaOwner.profile_image}` 
      : getDefaultAvatar(name);
      
    setImagePreview(fullImageUrl);
  }, [profile, name, ideaOwner.phone, ideaOwner.bio, ideaOwner.profile_image]);

  const handleSave = async () => {
    try {
      const response = await onEditProfile(editData);
      if (response) setIsEditing(false);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setEditData({ ...editData, profile_image: file });
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="lg:w-1/3 bg-white border border-slate-200 rounded-2xl shadow-sm p-8 h-fit sticky top-24">
      {/* القسم العلوي: الصورة والاسم */}
      <div className="flex flex-col items-center gap-5 mb-8">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-slate-50 relative">
        <Image
  src={avatar}
  alt={name}
  fill
  className="object-cover"
/>
          </div>

          {isEditing && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full shadow-lg transition-transform active:scale-95"
            >
              <Camera size={18} />
            </button>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">{name}</h2>
          <p className="text-sm text-slate-500 font-medium">Idea Owner</p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
            isEditing 
              ? "bg-slate-100 text-slate-600 hover:bg-slate-200" 
              : "bg-blue-50 text-blue-600 hover:bg-blue-100"
          }`}
        >
          {isEditing ? <><X size={16} /> Cancel</> : <><Edit size={16} /> Edit Profile</>}
        </button>
      </div>

      {/* قسم الـ BIO */}
      <div className="mb-8">
        <label className="block text-sm font-bold text-slate-700 mb-3">About Me</label>
        {isEditing ? (
          <textarea
            className="w-full border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            rows={4}
            placeholder="Tell us about yourself..."
            value={editData.bio}
            onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
          />
        ) : (
          <p className="p-4 bg-slate-50 rounded-xl text-slate-600 text-sm leading-relaxed border border-slate-100">
            {ideaOwner.bio || "No bio added yet. Add one to introduce yourself!"}
          </p>
        )}
      </div>

      {/* قسم التواصل */}
      <div className="space-y-4">
        <label className="block text-sm font-bold text-slate-700">Contact Information</label>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Email Address</p>
              <p className="text-sm font-medium text-slate-700">{email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
              <Phone size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Phone Number</p>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  className="w-full mt-1 border-b border-slate-200 focus:border-blue-500 outline-none text-sm py-1 bg-transparent"
                />
              ) : (
                <p className="text-sm font-medium text-slate-700">{ideaOwner.phone || "Not set"}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <button
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={updating}
          onClick={handleSave}
        >
          {updating ? "Processing..." : "Save Changes"}
        </button>
      )}
    </div>
  );
};

export default ProfileSidebar;