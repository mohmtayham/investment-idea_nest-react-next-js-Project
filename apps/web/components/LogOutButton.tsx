"use client";

import { signOut } from "../lib/auth"; // المسار الصحيح لملف الـ Actions

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut()}
      className="bg-red-500 text-white p-2 rounded"
    >
      Sign Out
    </button>
  );
}