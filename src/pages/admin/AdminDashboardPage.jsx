import { useEffect, useState } from 'react';
import { Boxes, ListChecks, Mail, Shapes } from 'lucide-react';
import LoadingState from '@/components/ui/LoadingState';
import { getDashboardSnapshot } from '@/services/dashboardService';

const icons = [Boxes, ListChecks, Mail, Shapes];

export default function AdminDashboardPage() {
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    getDashboardSnapshot().then(setSnapshot);
  }, []);

  if (!snapshot) {
    return <LoadingState label="Loading dashboard..." />;
  }

  const cards = [
    { label: 'Products', value: snapshot.parts.length, accent: 'bg-brand-50 text-brand-700' },
    { label: 'Part requests', value: snapshot.requests.length, accent: 'bg-ink-100 text-ink-800' },
    { label: 'Messages', value: snapshot.messages.length, accent: 'bg-ink-200 text-ink-900' },
    { label: 'Categories', value: snapshot.categories.length, accent: 'bg-ink-100 text-ink-700' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Dashboard</h1>
        <p className="mt-2 text-sm text-ink-600">A quick view of products, requests, messages, and categories.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = icons[index];
          return (
            <div key={card.label} className="card-surface rounded-3xl p-5">
              <div className={`inline-flex rounded-2xl p-3 ${card.accent}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-sm font-semibold text-ink-500">{card.label}</p>
              <p className="mt-2 text-3xl font-extrabold text-ink-900">{card.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
