import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, MessageCircleMore, Search, ShieldCheck, Truck, Wrench } from 'lucide-react';
import { getParts } from '@/services/partsService';
import { buildPartsQuery, buildRequestQuery, buildWhatsAppLink, formatCurrency } from '@/lib/utils';
import { useSiteContent } from '@/hooks/useSiteContent';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import PageMeta from '@/components/ui/PageMeta';
import SectionHeading from '@/components/ui/SectionHeading';
import VehicleSelector from '@/components/vehicles/VehicleSelector';
import VehicleSelectorModal from '@/components/vehicles/VehicleSelectorModal';

const initialVehicle = {
  make: '',
  model: '',
  year: '',
};

const trustItems = [
  { icon: ShieldCheck, label: 'Genuine & aftermarket parts' },
  { icon: Wrench, label: 'Fast stock checks' },
  { icon: MessageCircleMore, label: 'WhatsApp support' },
];

const orderingSteps = [
  {
    title: 'Search or send your part',
    description: 'Use the part name or share the vehicle details.',
  },
  {
    title: 'We confirm fitment & price',
    description: 'Simon checks stock, match, and current price.',
  },
  {
    title: 'Pick up or delivery',
    description: 'Move once the right part is confirmed.',
  },
];

export default function HomePage() {
  const [featuredParts, setFeaturedParts] = useState([]);
  const [vehicle, setVehicle] = useState(initialVehicle);
  const [searchText, setSearchText] = useState('');
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const navigate = useNavigate();
  const { homepageSettings, siteSettings } = useSiteContent();

  useEffect(() => {
    getParts().then((parts) => {
      const activeParts = parts.filter((part) => part.is_active !== false);

      if (homepageSettings.featured_product_ids.length) {
        const selected = homepageSettings.featured_product_ids
          .map((id) => activeParts.find((part) => String(part.id) === String(id)))
          .filter(Boolean)
          .slice(0, 6);

        if (selected.length) {
          setFeaturedParts(selected);
          return;
        }
      }

      const featuredFirst = activeParts.filter((part) => part.featured).slice(0, 6);
      if (featuredFirst.length) {
        setFeaturedParts(featuredFirst);
        return;
      }

      setFeaturedParts(activeParts.slice(0, 6));
    });
  }, [homepageSettings.featured_product_ids]);

  const heroHint = useMemo(() => {
    if (vehicle.make && vehicle.model) {
      return `${vehicle.make} ${vehicle.model}${vehicle.year ? ` ${vehicle.year}` : ''}`;
    }
    return homepageSettings.search_placeholder;
  }, [homepageSettings.search_placeholder, vehicle]);

  const buildCurrentRequestLink = () =>
    buildRequestQuery({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      part: searchText,
    });

  const handleVehicleChange = (field, value) => {
    if (field === 'make') {
      setVehicle({ make: value, model: '', year: '' });
      return;
    }

    if (field === 'model') {
      setVehicle((current) => ({ ...current, model: value, year: '' }));
      return;
    }

    setVehicle((current) => ({ ...current, [field]: value }));
  };

  const handleVehicleSubmit = () => {
    navigate(
      buildPartsQuery({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        search: searchText,
      }),
    );
    setIsVehicleModalOpen(false);
  };

  const handleSearchSubmit = () => {
    navigate(
      buildPartsQuery({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        search: searchText,
      }),
    );
  };

  return (
    <div className="overflow-hidden">
      <PageMeta
        title="Find the right part fast"
        description="Search parts, check stock, and send vehicle details quickly with Simon Spare Parts in Nairobi."
      />

      <section className="relative border-b border-ink-200 bg-ink-900">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={homepageSettings.hero_background_image}
            alt="Vehicle spare parts and workshop setup"
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,13,0.34)_0%,rgba(11,11,13,0.64)_48%,rgba(11,11,13,0.84)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(230,57,70,0.16),transparent_34%)]" />
        </div>

        <div className="container-shell relative py-3.5 sm:py-7 lg:py-9">
          <div className="max-w-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-200">Spare parts in Nairobi</p>
            <h1 className="mt-1.5 max-w-lg text-[1.35rem] font-extrabold tracking-[-0.04em] text-white sm:text-[2.3rem] sm:leading-[0.98]">
              {homepageSettings.hero_heading}
            </h1>
            <p className="mt-1 max-w-md text-[12px] leading-5 text-ink-100 sm:text-[14px] sm:leading-6">{homepageSettings.hero_subheading}</p>

            <div className="mt-2.5 max-w-lg rounded-[1rem] border border-white/70 bg-white/95 p-2 shadow-[0_26px_70px_-36px_rgba(11,11,13,0.72)] backdrop-blur sm:rounded-[1.2rem] sm:p-3">
              <label className="label-base text-ink-800">Search by part or vehicle</label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  <input
                    className="input-base h-9 border-ink-200 bg-ink-50 pl-10 sm:h-10"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    placeholder={`e.g. ${heroHint}`}
                    aria-label="Search by part name or vehicle"
                  />
                </div>
                <Button size="sm" className="h-9 px-4 sm:h-10 sm:min-w-[108px]" onClick={handleSearchSubmit}>
                  Search
                </Button>
              </div>

              <div className="mt-2 flex items-center justify-between rounded-xl border border-ink-200 bg-ink-50 px-3 py-2 sm:hidden">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-500">Vehicle</p>
                  <p className="truncate text-[12px] font-medium text-ink-700">
                    {vehicle.make || vehicle.model || vehicle.year
                      ? [vehicle.make, vehicle.model, vehicle.year].filter(Boolean).join(' · ')
                      : 'Optional. Add make, model, or year.'}
                  </p>
                </div>
                <button type="button" onClick={() => setIsVehicleModalOpen(true)} className="shrink-0 text-[12px] font-semibold text-brand-700 hover:text-brand-800">
                  {vehicle.make || vehicle.model || vehicle.year ? 'Edit' : 'Add'}
                </button>
              </div>

              <VehicleSelector values={vehicle} onChange={handleVehicleChange} onSubmit={handleVehicleSubmit} submitLabel="Find parts" className="mt-2 hidden sm:block" />

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Link to={buildCurrentRequestLink()}>
                  <Button size="xs">{homepageSettings.secondary_cta_text}</Button>
                </Link>
                <Link to="/parts">
                  <Button variant="secondary" size="xs">{homepageSettings.primary_cta_text}</Button>
                </Link>
                <button type="button" onClick={() => setIsVehicleModalOpen(true)} className="text-[12px] font-semibold text-brand-700 hover:text-brand-800 sm:text-[13px]">
                  {vehicle.make || vehicle.model || vehicle.year ? 'Open vehicle picker' : 'Add vehicle'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {homepageSettings.show_trust_strip ? (
        <section className="border-b border-ink-200 bg-white">
          <div className="container-shell py-2.5">
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0">
              {trustItems.map(({ icon: Icon, label }) => (
                <div key={label} className="flex min-w-[13rem] items-center gap-2 rounded-xl border border-ink-200 bg-ink-50 px-3 py-2 sm:min-w-0">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-brand-700 shadow-sm">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-[12px] font-semibold leading-4 text-ink-800">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {homepageSettings.show_featured_products && featuredParts.length ? (
        <section className="section-shell bg-ink-50 py-5 sm:py-8">
          <div className="container-shell">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                eyebrow="In stock now"
                title="Popular parts"
                description="Real parts customers ask for often."
              />
              <Link to="/parts" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800">
                Browse all parts
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2.5 sm:mt-4 sm:gap-3 xl:grid-cols-4">
              {featuredParts.map((part) => {
                const inquiryLink = buildWhatsAppLink(
                  `Hello Simon, I would like to inquire about ${part.name} for ${part.vehicle_make} ${part.vehicle_model}.`,
                  siteSettings.whatsapp_number,
                );
                const vehicleLabel = [part.vehicle_make, part.vehicle_model, part.vehicle_year].filter(Boolean).join(' · ');

                return (
                  <article key={part.id} className="card-surface flex h-full flex-col overflow-hidden rounded-[1rem]">
                    <div className={`overflow-hidden ${part.image_url ? 'aspect-[4/3] bg-ink-100' : 'border-b border-ink-200 bg-ink-50 px-2.5 py-2'}`}>
                      {part.image_url ? (
                        <ImageWithFallback src={part.image_url} alt={part.name} loading="lazy" className="h-full w-full object-cover" />
                      ) : (
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-400">No image yet</p>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-2.5 sm:p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-600">{part.category?.name || 'Part'}</p>
                          <h3 className="mt-1 line-clamp-2 text-[14px] font-bold leading-5 text-ink-900">{part.name}</h3>
                        </div>
                        <Badge className="shrink-0">{part.stock_status}</Badge>
                      </div>
                      <p className="mt-1 line-clamp-2 text-[12px] leading-4 text-ink-600">{vehicleLabel || 'Ask for fitment details'}</p>
                      <p className="mt-2 text-[1.02rem] font-extrabold tracking-tight text-ink-900">
                        {part.price_visible ? formatCurrency(part.price) : 'Request price'}
                      </p>
                      <div className="mt-2 grid grid-cols-2 gap-1.5 pt-1">
                        <a href={inquiryLink} target="_blank" rel="noreferrer">
                          <Button variant="secondary" size="xs" className="w-full">
                            <MessageCircleMore className="h-3.5 w-3.5" />
                            Ask
                          </Button>
                        </a>
                        <Link to={`/parts/${part.slug}`}>
                          <Button size="xs" className="w-full">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-shell bg-white py-5 sm:py-8">
        <div className="container-shell grid gap-4 lg:grid-cols-[0.95fr,1.05fr]">
          <div>
            <SectionHeading
              eyebrow="Why choose us"
              title="Built for fast checks"
            />
            <div className="mt-3 grid gap-2.5">
              {whyChooseUs.map((item) => (
                <div key={item.title} className="flex items-center gap-3 rounded-[1rem] border border-ink-200 bg-ink-50 px-3.5 py-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-600" />
                  <h3 className="text-[14px] font-semibold text-ink-900 sm:text-[15px]">{item.title}</h3>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow="How it works"
              title="A simple flow"
            />
            <div className="mt-3 grid gap-2.5">
              {orderingSteps.map((step, index) => (
                <div key={step.title} className="card-surface rounded-[1rem] p-3.5">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[11px] font-extrabold text-brand-700">
                      0{index + 1}
                    </span>
                    <div>
                      <h3 className="text-[14px] font-bold text-ink-900 sm:text-[15px]">{step.title}</h3>
                      <p className="mt-1 text-[12px] leading-5 text-ink-600 sm:text-[13px]">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {homepageSettings.show_bottom_cta ? (
        <section className="section-shell bg-white py-5 sm:py-7">
          <div className="container-shell">
            <div className="grid gap-2.5 rounded-[1.2rem] border border-ink-200 bg-[linear-gradient(135deg,#0B0B0D_0%,#1F1F24_100%)] px-4 py-3.5 text-white shadow-[0_24px_60px_-38px_rgba(11,11,13,0.78)] sm:px-5 sm:py-4 lg:grid-cols-[1fr,auto] lg:items-center">
              <div className="max-w-xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-200">Need help fast?</p>
                <h2 className="mt-1 text-[1.2rem] font-extrabold tracking-[-0.03em] sm:text-[1.45rem]">{homepageSettings.bottom_cta_heading}</h2>
                <p className="mt-1 text-[12px] leading-5 text-ink-200 sm:text-[13px] sm:leading-5">{homepageSettings.bottom_cta_subtext}</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link to={buildCurrentRequestLink()}>
                  <Button variant="accent" size="sm" className="w-full sm:w-auto">
                    {homepageSettings.secondary_cta_text}
                  </Button>
                </Link>
                <a
                  href={buildWhatsAppLink('Hello Simon, I need help finding the right spare part for my vehicle.', siteSettings.whatsapp_number)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="secondary" size="sm" className="w-full bg-white text-ink-900 sm:w-auto">
                    Chat on WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <VehicleSelectorModal
        open={isVehicleModalOpen}
        values={vehicle}
        onChange={handleVehicleChange}
        onClose={() => setIsVehicleModalOpen(false)}
        onSubmit={handleVehicleSubmit}
      />
    </div>
  );
}
