import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/parts?category=${category.id}`}
      className="card-surface group block overflow-hidden rounded-[1rem] transition duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-xl sm:rounded-[1.2rem]"
    >
      {category.image_url ? (
        <div className="aspect-[16/9] overflow-hidden bg-ink-100">
          <ImageWithFallback src={category.image_url} alt={category.name} loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
        </div>
      ) : null}
      <div className="p-3 sm:p-3.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-700">Category</p>
        <h3 className="mt-1 text-[14px] font-bold text-ink-900 sm:text-[15px]">{category.name}</h3>
        <span className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-700">
          Browse
          <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
