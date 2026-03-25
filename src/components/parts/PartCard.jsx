import { Link } from 'react-router-dom';
import { ImageIcon, MessageCircleMore } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { useSiteContent } from '@/hooks/useSiteContent';
import { buildWhatsAppLink, formatCurrency } from '@/lib/utils';

export default function PartCard({ part }) {
  const { siteSettings } = useSiteContent();
  const message = `Hello Simon, I would like to inquire about ${part.name} for ${part.vehicle_make} ${part.vehicle_model}.`;
  const hasImage = Boolean(part.image_url);

  return (
    <article className="card-surface flex h-full flex-col overflow-hidden rounded-[1.6rem]">
      <div className={`relative overflow-hidden ${hasImage ? 'aspect-[4/3] bg-stone-100' : 'border-b border-stone-200 bg-stone-50 px-4 py-3'}`}>
        {hasImage ? <ImageWithFallback src={part.image_url} alt={part.name} loading="lazy" className="h-full w-full object-cover" /> : <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">No image uploaded</p>}
        {hasImage ? (
          <div className="absolute bottom-3 right-3">
            <a href={part.image_url} target="_blank" rel="noreferrer">
              <Button variant="secondary" size="sm" className="bg-white/95">
                <ImageIcon className="h-4 w-4" />
                View image
              </Button>
            </a>
          </div>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-600">{part.category?.name || 'Part'}</p>
            <h3 className="mt-1.5 text-base font-bold leading-6 text-ink-900">{part.name}</h3>
          </div>
          <Badge>{part.stock_status}</Badge>
        </div>
        <p className="mt-2 text-sm leading-6 text-ink-600">
          {part.vehicle_make} {part.vehicle_model}
          {part.vehicle_year ? ` · ${part.vehicle_year}` : ''}
        </p>
        <p className="mt-4 text-xl font-extrabold tracking-tight text-ink-900">
          {part.price_visible ? formatCurrency(part.price) : 'Request Price'}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2.5 pt-2">
          <a href={buildWhatsAppLink(message, siteSettings.whatsapp_number)} target="_blank" rel="noreferrer">
            <Button variant="secondary" size="sm" className="w-full">
              <MessageCircleMore className="h-4 w-4" />
              Inquire
            </Button>
          </a>
          <Link to={`/parts/${part.slug}`}>
            <Button size="sm" className="w-full">
              View details
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
