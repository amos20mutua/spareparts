import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/parts?category=${category.id}`}
      className="card-surface group block overflow-hidden rounded-[1.1rem] transition duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-xl sm:rounded-[1.4rem]"
    >
      {category.image_url ? (
        <div className="aspect-[16/10] overflow-hidden bg-stone-100">
          <ImageWithFallback src={category.image_url} alt={category.name} loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
        </div>
      ) : null}
      <div className="p-3.5 sm:p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-700">Category</p>
        <h3 className="mt-1.5 text-[15px] font-bold text-ink-900 sm:text-base">{category.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-5 text-ink-600 sm:text-sm sm:leading-6">{category.description || 'Browse available parts in this category.'}</p>
        <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
          Browse
          <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
