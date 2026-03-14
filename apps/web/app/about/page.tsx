import { FeatureSection } from '@/components/sections/FeatureSection';

// الجلب يحدث فقط عندما يزور المستخدم مسار /about
async function getFeatures() {
  const res = await fetch('http://localhost:8000/api/admin/contents/index?type=feature', {
    cache: 'no-store'
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function AboutPage() {
  const data = await getFeatures();

  return (
    <main className="pt-24">
      {/* تمرير البيانات لقسم المميزات */}
      <FeatureSection featuresData={data} />
    </main>
  );
}