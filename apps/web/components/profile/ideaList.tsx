"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Users, CheckCircle } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "text-yellow-600 bg-yellow-100",
  approved: "text-green-700 bg-green-100",
  rejected: "text-red-700 bg-red-100",
};

type Idea = {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  roadmap_stage?: string;
  committee?: {
    name: string;
  };
};

const IdeasList = ({ ideas }: { ideas: Idea[] }) => {
  if (!ideas || ideas.length === 0) {
    return (
      <div className="p-6 bg-white border border-slate-200 rounded-xl text-center text-slate-500">
        No ideas yet — start by submitting your first idea
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Array.isArray(ideas) ? (
        ideas.map((idea) => (
          <Link
            key={idea.id}
            href={`/ideas/${idea.id}/roadmap`}
            className="block p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {idea.title}
              </h3>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  statusColors[idea.status] ||
                  "bg-gray-100 text-gray-600"
                }`}
              >
                {idea.status}
              </span>
            </div>

            <p className="text-slate-600 mb-4 line-clamp-2">
              {idea.description}
            </p>

            <div className="flex flex-wrap gap-6 text-sm text-slate-500 border-t border-slate-50 pt-4">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" />
                <span>
                  {new Date(idea.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500" />
                <span className="font-medium text-slate-700">
                  Stage: {idea.roadmap_stage || "Initial"}
                </span>
              </div>

              {idea.committee && (
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-blue-500" />
                  <span className="font-medium text-slate-700">
                    {idea.committee.name}
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))
      ) : (
        <p>No ideas found.</p>
      )}
    </div>
  );
};

export default IdeasList;