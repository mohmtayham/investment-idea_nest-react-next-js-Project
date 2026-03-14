// src/components/sections/FeatureSection.tsx
import { FeatureCard } from '../ui/FeatureCard';

export const FeatureSection = ({ featuresData }: { featuresData: any[] }) => {
  return (
    <div className="bg-[#0F172A] py-20 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {featuresData.map((item) => (
          <FeatureCard key={item.id} title={item.title} text={item.text} />
        ))}
      </div>
    </div>
  );
};