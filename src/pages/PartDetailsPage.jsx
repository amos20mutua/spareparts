import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MessageCircleMore } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import PartCard from '@/components/parts/PartCard';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { useSiteContent } from '@/hooks/useSiteContent';
import { getPartBySlug, getParts } from '@/services/partsService';
import { buildWhatsAppLink, formatCurrency, shuffleBySeed } from '@/lib/utils';

export default function PartDetailsPage() {
  const { slug } = useParams();
  const [part, setPart] = useState(null);
  const [relatedParts, setRelatedParts] = useState([]);
  const { siteSettings } = useSiteContent();

  useEffect(() => {
    getPartBySlug(slug).then((currentPart) => {
      setPart(currentPart);
      if (currentPart) {
        getParts({ category: currentPart.category_id }).then((items) =>
          setRelatedParts(shuffleBySeed(items.filter((item) => item.slug !== currentPart.slug), `${currentPart.id}-related`).slice(0, 3)),
        );
      }
    });
  }, [slug]);

  if (!part) {
    return (
      <div className="container-shell py-12">
        <LoadingState label="Loading part details..." />
      </div>
    );
  }

  return (
    <div className="container-shell py-10 sm:py-12">
      <div className="grid gap-6 lg:grid-cols-[0.95fr,1.05fr]">
        <div className="card-surface overflow-hidden rounded-[1.8rem]">
          <div className="relative">
            <ImageWithFallback src={part.image_url} alt={part.name} loading="eager" className="h-full max-h-[420px] w-full object-cover" />
            {part.image_url ? (
              <div className="absolute bottom-4 right-4">
                <a href={part.image_url} target="_blank" rel="noreferrer">
                  <Button variant="secondary" size="sm">
                    View image
                  </Button>
                </a>
              </div>
            ) : null}
          </div>
        </div>
        <div className="card-surface rounded-[1.8rem] p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600">{part.category?.name || 'Part'}</p>
          <h1 className="mt-2 text-[2rem] font-extrabold tracking-tight text-ink-900 sm:text-[2.3rem]">{part.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Badge>{part.stock_status}</Badge>
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-ink-700">{part.condition}</span>
          </div>
          <p className="mt-5 text-[15px] leading-7 text-ink-700">{part.description}</p>
          <div className="mt-5 grid gap-3 rounded-[1.5rem] bg-stone-100 p-4 sm:grid-cols-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-500">Compatibility</p>
              <p className="mt-2 text-sm font-semibold text-ink-900">
                {part.vehicle_make} {part.vehicle_model}
              </p>
              <p className="mt-1 text-sm text-ink-600">{part.vehicle_year || 'Confirm year fitment'}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-500">Price</p>
              <p className="mt-2 text-xl font-extrabold text-ink-900">
                {part.price_visible ? formatCurrency(part.price) : 'Request Price'}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-500">Support</p>
              <p className="mt-2 text-sm font-semibold text-ink-900">Quick WhatsApp check</p>
              <p className="mt-1 text-sm text-ink-600">Confirm stock and fitment before purchase.</p>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            <a
              href={buildWhatsAppLink(`Hello Simon, I would like to inquire about ${part.name} for ${part.vehicle_make} ${part.vehicle_model}.`, siteSettings.whatsapp_number)}
              target="_blank"
              rel="noreferrer"
            >
              <Button size="lg">
                <MessageCircleMore className="h-4 w-4" />
                Inquire on WhatsApp
              </Button>
            </a>
            <Link to="/request-part">
              <Button variant="secondary" size="lg">
                Request Similar Part
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <section className="mt-12">
        <SectionHeading eyebrow="Related Parts" title="Other parts in the same category" description="Useful alternatives and related repair items." />
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {relatedParts.map((item) => (
            <PartCard key={item.id} part={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
