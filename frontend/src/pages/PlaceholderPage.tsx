import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  phase: string;
}

export default function PlaceholderPage({ title, phase }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
        <Construction size={36} className="text-warning" />
      </div>
      <h2 className="text-2xl font-bold text-primary-900 mb-2">{title}</h2>
      <p className="text-gray-500 mb-1">هذه الصفحة قيد التطوير</p>
      <p className="text-sm text-gray-400">{phase}</p>
    </div>
  );
}
