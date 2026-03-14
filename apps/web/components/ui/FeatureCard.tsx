// src/components/ui/FeatureCard.tsx
export const FeatureCard = ({ title, text, icon }: any) => (
  <div className="bg-white group cursor-pointer h-full rounded-[2.5rem] p-8 shadow-xl">
    <div className="flex mb-6 h-14 w-14 bg-orange-50 text-orange-600 items-center justify-center rounded-2xl">
      {icon}
    </div>
    <h5 className="mb-4 text-2xl font-black text-[#0F172A]">{title}</h5>
    <p className="text-md text-gray-500">{text}</p>
  </div>
);