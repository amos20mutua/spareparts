import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, MessageCircleMore, Search, ShieldCheck, Truck, Wrench } from 'lucide-react';
import { getParts } from '@/services/partsService';
import { getCategories } from '@/services/categoriesService';
import { buildPartsQuery, buildRequestQuery, buildWhatsAppLink, formatCurrency } from '@/lib/utils';
import { useSiteContent } from '@/hooks/useSiteContent';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import PageMeta from '@/components/ui/PageMeta';
import SectionHeading from '@/components/ui/SectionHeading';
import VehicleSelector from '@/components/vehicles/VehicleSelector';
import VehicleSelectorModal from '@/components/vehicles/VehicleSelectorModal';
import CategoryCard from '@/components/parts/CategoryCard';

const initialVehicle = {
  make: '',
  model: '',
  year: '',
};

const trustIcons = [ShieldCheck, Wrench, MessageCircleMore, Truck];

const whyChooseUs = [
  {
    title: 'Fitment guidance',
    description: 'Share the vehicle or part number and get a more useful answer before you spend.',
  },
  {
    title: 'Fast stock checks',
    description: 'Price, availability, and sourcing updates stay practical and direct.',
  },
  {
    title: 'Easy follow-up',
    description: 'WhatsApp, call, and part requests stay visible throughout the site.',
  },
];

const orderingSteps = [
  {
    title: 'Search or send the vehicle',
    description: 'Use the part name or start with make, model, and year.',
  },
  {
    title: 'Confirm fitment and price',
    description: 'Simon checks the best available match and current stock status.',
  },
  {
    title: 'Pick up or arrange delivery',
    description: 'Move fast once the right part is confirmed.',
  },
];

export default function HomePage() {
  const [featuredParts, setFeaturedParts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vehicle, setVehicle] = useState(initialVehicle);
  const [searchText, setSearchText] = useState('');
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const navigate = useNavigate();
  const { homepageSettings, siteSettings } = useSiteContent();

  useEffect(() => {
    getParts({ featuredOnly: true }).then((parts) => {
      if (homepageSettings.featured_product_ids.length) {
        const selected = homepageSettings.featured_product_ids
          .map((id) => parts.find((part) => String(part.id) === String(id)))
          .filter(Boolean)
          .slice(0, 4);

        if (selected.length) {
          setFeaturedParts(selected);
          return;
        }
      }

      setFeaturedParts(parts.slice(0, 4));
    });

    getCategories().then(setCategories);
  }, [homepageSettings.featured_product_ids]);

  const heroHint = useMemo(() => {
    if (vehicle.make && vehicle.model) {
      return `${vehicle.make} ${vehicle.model}${vehicle.year ? ` ${vehicle.year}` : ''}`;
    }
    return homepageSettings.search_placeholder;
  }, [homepageSettings.search_placeholder, vehicle]);

  const categoriesForHome = useMemo(() => {
    const homepageFirst = categories
      .filter((category) => category.show_on_homepage)
      .sort((first, second) => Number(first.homepage_order || 0) - Number(second.homepage_order || 0));

    return (homepageFirst.length ? homepageFirst : categories).slice(0, 4);
  }, [categories]);

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

      <section className="relative border-b border-stone-200 bg-ink-900">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={homepageSettings.hero_background_image}
            alt="Vehicle spare parts and workshop setup"
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.46)_0%,rgba(15,23,42,0.72)_52%,rgba(15,23,42,0.82)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,77,164,0.24),transparent_34%)]" />
        </div>

        <div className="container-shell relative py-5 sm:py-10 lg:py-12">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-200">Spare parts in Nairobi</p>
            <h1 className="mt-2 max-w-xl text-[1.65rem] font-extrabold tracking-[-0.04em] text-white sm:text-[2.7rem] sm:leading-[0.98]">
              {homepageSettings.hero_heading}
            </h1>
            <p className="mt-1.5 max-w-lg text-[13px] leading-5 text-stone-100 sm:text-[15px] sm:leading-6">{homepageSettings.hero_subheading}</p>

            <div className="mt-3 max-w-2xl rounded-[1.15rem] border border-white/70 bg-white/95 p-2.5 shadow-[0_26px_70px_-36px_rgba(15,23,42,0.8)] backdrop-blur sm:rounded-[1.4rem] sm:p-4">
              <label className="label-base text-ink-800">Search by part or vehicle</label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  <input
                    className="input-base h-10 border-stone-300 bg-stone-50 pl-10 sm:h-11"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    placeholder={`e.g. ${heroHint}`}
                    aria-label="Search by part name or vehicle"
                  />
                </div>
                <Button size="sm" className="h-10 px-4 sm:h-11 sm:min-w-[120px]" onClick={handleSearchSubmit}>
                  Search
                </Button>
              </div>
              <VehicleSelector values={vehicle} onChange={handleVehicleChange} onSubmit={handleVehicleSubmit} submitLabel="Find parts" className="mt-2.5" />
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <Link to={buildCurrentRequestLink()}>
                  <Button size="xs">{homepageSettings.secondary_cta_text}</Button>
                </Link>
                <Link to="/parts">
                  <Button variant="secondary" size="xs">{homepageSettings.primary_cta_text}</Button>
                </Link>
                <button type="button" onClick={() => setIsVehicleModalOpen(true)} className="text-[12px] font-semibold text-brand-700 hover:text-brand-800 sm:text-[13px]">
                  Step-by-step vehicle picker
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {homepageSettings.show_trust_strip ? (
        <section className="border-b border-stone-200 bg-white">
          <div className="container-shell py-3">
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
              {homepageSettings.trust_items.slice(0, 4).map((item, index) => {
                const Icon = trustIcons[index % trustIcons.length];
                return (
                  <div
                    key={item}
                    className="flex min-w-[15rem] items-center gap-2 rounded-xl border border-stone-200 bg-stone-50/70 px-3 py-2 sm:min-w-0"
                  >
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-brand-700 shadow-sm">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-[12px] font-semibold leading-4 text-ink-800 sm:text-sm sm:leading-5">{item}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-shell bg-white">
        <div className="container-shell">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="What Simon supplies"
              title="Quick categories and common repair parts"
              description="Browse fast-moving categories or jump straight into the full catalog."
            />
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <a href={buildWhatsAppLink('Hello Simon, I need help finding the right vehicle part.', siteSettings.whatsapp_number)} target="_blank" rel="noreferrer">
                <Button variant="secondary" size="sm">WhatsApp</Button>
              </a>
              <Link to="/parts">
                <Button size="sm">Browse parts</Button>
              </Link>
            </div>
          </div>

          {categoriesForHome.length ? (
            <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
              {categoriesForHome.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState
                title="Categories will appear here"
                description="Add categories from the admin dashboard to organize the public catalog."
                action={
                  <Link to="/parts">
                    <Button variant="secondary">Browse current parts</Button>
                  </Link>
                }
              />
            </div>
          )}
        </div>
      </section>

      {homepageSettings.show_featured_products ? (
        <section className="section-shell bg-stone-50">
          <div className="container-shell">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                eyebrow="Featured parts"
                title="Common checks customers ask for"
                description="Useful for quick stock checks, pricing, and fitment confirmation."
              />
              <Link to="/parts" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800">
                Browse all parts
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {featuredParts.length ? (
              <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
                {featuredParts.map((part) => {
                  const inquiryLink = buildWhatsAppLink(
                    `Hello Simon, I would like to inquire about ${part.name} for ${part.vehicle_make} ${part.vehicle_model}.`,
                    siteSettings.whatsapp_number,
                  );
                  const vehicleLabel = [part.vehicle_make, part.vehicle_model, part.vehicle_year].filter(Boolean).join(' · ');

                  return (
                    <article key={part.id} className="card-surface flex h-full flex-col overflow-hidden rounded-[1.15rem] sm:rounded-[1.4rem]">
                      <div className={`overflow-hidden ${part.image_url ? 'aspect-[4/3] bg-stone-100' : 'border-b border-stone-200 bg-stone-50 px-3 py-2.5'}`}>
                        {part.image_url ? (
                          <ImageWithFallback src={part.image_url} alt={part.name} loading="lazy" className="h-full w-full object-cover" />
                        ) : (
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-400">No image yet</p>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-3 sm:p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-600">{part.category?.name || 'Part'}</p>
                            <h3 className="mt-1 text-[15px] font-bold leading-5 text-ink-900 sm:text-base">{part.name}</h3>
                          </div>
                          <Badge className="shrink-0">{part.stock_status}</Badge>
                        </div>
                        <p className="mt-1.5 text-[13px] leading-5 text-ink-600 sm:text-sm">{vehicleLabel}</p>
                        <p className="mt-3 text-lg font-extrabold tracking-tight text-ink-900 sm:text-xl">
                          {part.price_visible ? formatCurrency(part.price) : 'Request Price'}
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-2 pt-1">
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
            ) : (
              <div className="mt-4">
                <EmptyState
                  title="No featured parts yet"
                  description="Add products in admin and mark a few as featured to fill this section."
                  action={
                    <Link to={buildCurrentRequestLink()}>
                      <Button>Request a part</Button>
                    </Link>
                  }
                />
              </div>
            )}
          </div>
        </section>
      ) : null}

      <section className="section-shell bg-white">
        <div className="container-shell grid gap-5 lg:grid-cols-[1.05fr,0.95fr]">
          <div>
            <SectionHeading
              eyebrow="Why customers choose us"
              title="Built for quick checks and useful follow-up"
              description="The site stays practical: check parts fast, confirm fitment, and get a direct response."
            />
            <div className="mt-4 grid gap-3">
              {whyChooseUs.map((item) => (
                <div key={item.title} className="rounded-[1.1rem] border border-stone-200 bg-stone-50/70 p-4 sm:rounded-[1.35rem]">
                  <h3 className="text-[15px] font-bold text-ink-900 sm:text-base">{item.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-5 text-ink-600 sm:text-sm sm:leading-6">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow="How ordering works"
              title="A simple flow for urgent repairs"
              description="Customers usually arrive with a part name, a vehicle, or a photo. Simon handles the next step from there."
            />
            <div className="mt-4 grid gap-3">
              {orderingSteps.map((step, index) => (
                <div key={step.title} className="card-surface rounded-[1.1rem] p-4 sm:rounded-[1.35rem]">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-extrabold text-brand-700">
                      0{index + 1}
                    </span>
                    <div>
                      <h3 className="text-[15px] font-bold text-ink-900 sm:text-base">{step.title}</h3>
                      <p className="mt-1.5 text-[13px] leading-5 text-ink-600 sm:text-sm sm:leading-6">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-[1.1rem] border border-emerald-200 bg-emerald-50 px-4 py-3.5 sm:rounded-[1.35rem]">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 text-emerald-600" />
                <div>
                  <p className="text-sm font-bold text-ink-900">Useful for garages and daily drivers</p>
                  <p className="mt-1 text-[13px] leading-5 text-ink-600 sm:text-sm sm:leading-6">
                    Best when you need a faster stock check, a part confirmation, or a sourcing option.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {homepageSettings.show_bottom_cta ? (
        <section className="section-shell bg-white">
          <div className="container-shell">
            <div className="grid gap-3 rounded-[1.4rem] border border-stone-200 bg-[linear-gradient(135deg,#111827_0%,#1f2937_100%)] px-4 py-4 text-white shadow-[0_24px_60px_-38px_rgba(15,23,42,0.8)] sm:px-5 sm:py-5 lg:grid-cols-[1fr,auto] lg:items-center">
              <div className="max-w-xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-200">Need help fast?</p>
                <h2 className="mt-1.5 text-[1.45rem] font-extrabold tracking-[-0.03em] sm:text-[1.7rem]">{homepageSettings.bottom_cta_heading}</h2>
                <p className="mt-1.5 text-[13px] leading-5 text-ink-200 sm:text-sm sm:leading-6">{homepageSettings.bottom_cta_subtext}</p>
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
