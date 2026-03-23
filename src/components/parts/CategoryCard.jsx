import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/parts?category=${category.id}`}
      className="card-surface group block rounded-[1.5rem] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-xl"
    >
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-700">Category</p>
      <h3 className="mt-2 text-base font-bold text-ink-900">{category.name}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-600">{category.description}</p>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
        Browse
        <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
