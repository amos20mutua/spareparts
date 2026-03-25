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
    title: 'Clear fitment support',
    description: 'Share the make, model, year, or part number and get a faster answer before you spend.',
  },
  {
    title: 'Useful stock checks',
    description: 'Customers get realistic updates on availability, pricing, and sourcing options.',
  },
  {
    title: 'Fast direct contact',
    description: 'WhatsApp and phone stay visible throughout the site so urgent jobs are easy to handle.',
  },
];

const orderingSteps = [
  {
    title: 'Search or send the vehicle',
    description: 'Start with the part name or select the vehicle details first.',
  },
  {
    title: 'Confirm fitment and price',
    description: 'Simon checks stock, compatibility, and the best available option.',
  },
  {
    title: 'Arrange pickup or delivery',
    description: 'Move forward quickly once the right part is confirmed.',
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

  const buildCurrentRequestLink = () =>
    buildRequestQuery({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      part: searchText,
    });

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
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.38)_0%,rgba(15,23,42,0.68)_50%,rgba(15,23,42,0.84)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,77,164,0.28),transparent_34%)]" />
        </div>

        <div className="container-shell relative py-10 sm:py-12 lg:py-14">
          <div className="max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-200">Spare parts in Nairobi</p>
            <h1 className="mt-3 max-w-2xl text-[2.15rem] font-extrabold tracking-[-0.04em] text-white sm:text-[3.1rem] sm:leading-[0.98]">
              {homepageSettings.hero_heading}
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-7 text-stone-100 sm:text-base">{homepageSettings.hero_subheading}</p>

            <div className="mt-6 max-w-2xl rounded-[1.8rem] border border-white/70 bg-white/95 p-4 shadow-[0_26px_70px_-36px_rgba(15,23,42,0.8)] backdrop-blur sm:p-5">
              <label className="label-base text-ink-800">Search parts or start with your vehicle</label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  <input
                    className="input-base h-12 border-stone-300 bg-stone-50 pl-10"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    placeholder={`e.g. ${heroHint}`}
                    aria-label="Search by part name or vehicle"
                  />
                </div>
                <Button className="h-12 px-5 sm:min-w-[132px]" onClick={handleSearchSubmit}>
                  Search
                </Button>
              </div>
              <VehicleSelector values={vehicle} onChange={handleVehicleChange} onSubmit={handleVehicleSubmit} submitLabel="Find Parts" className="mt-3" />
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Link to="/parts">
                  <Button variant="secondary">{homepageSettings.primary_cta_text}</Button>
                </Link>
                <Link to={buildCurrentRequestLink()}>
                  <Button>{homepageSettings.secondary_cta_text}</Button>
                </Link>
                <button type="button" onClick={() => setIsVehicleModalOpen(true)} className="text-sm font-semibold text-brand-700 hover:text-brand-800">
                  Use step-by-step vehicle picker
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {homepageSettings.show_trust_strip ? (
        <section className="border-b border-stone-200 bg-white">
          <div className="container-shell py-3.5">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {homepageSettings.trust_items.slice(0, 4).map((item, index) => {
                const Icon = trustIcons[index % trustIcons.length];
                return (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50/70 px-4 py-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-700 shadow-sm">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-semibold text-ink-800">{item}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-shell bg-white">
        <div className="container-shell">
          <div className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr] lg:items-end">
            <SectionHeading
              eyebrow="What Simon supplies"
              title="Fast-moving categories and common repair items"
              description="Start with the category you know or jump straight into the catalog if you already know the part."
            />
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <a href={buildWhatsAppLink('Hello Simon, I need help finding the right vehicle part.', siteSettings.whatsapp_number)} target="_blank" rel="noreferrer">
                <Button variant="secondary">Chat on WhatsApp</Button>
              </a>
              <Link to="/parts">
                <Button>Browse full catalog</Button>
              </Link>
            </div>
          </div>

          {categoriesForHome.length ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {categoriesForHome.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <div className="mt-6">
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
                title="Popular checks customers ask for"
                description="A quick look at parts people often check for price, stock, or fitment."
              />
              <Link to="/parts" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800">
                Browse all parts
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {featuredParts.length ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {featuredParts.map((part) => {
                  const inquiryLink = buildWhatsAppLink(
                    `Hello Simon, I would like to inquire about ${part.name} for ${part.vehicle_make} ${part.vehicle_model}.`,
                    siteSettings.whatsapp_number,
                  );

                  return (
                    <article key={part.id} className="card-surface flex h-full flex-col overflow-hidden rounded-[1.6rem]">
                      <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                        <ImageWithFallback src={part.image_url} alt={part.name} loading="lazy" className="h-full w-full object-cover" />
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
                          <a href={inquiryLink} target="_blank" rel="noreferrer">
                            <Button variant="secondary" size="sm" className="w-full">
                              <MessageCircleMore className="h-4 w-4" />
                              Inquire
                            </Button>
                          </a>
                          <Link to={`/parts/${part.slug}`}>
                            <Button size="sm" className="w-full">
                              View Part
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-6">
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
        <div className="container-shell grid gap-6 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Why customers choose us"
              title="Built for quick checks, honest answers, and useful follow-up"
              description="The goal is simple: help people move from uncertainty to the right part without wasting time."
            />
            <div className="mt-6 grid gap-4">
              {whyChooseUs.map((item) => (
                <div key={item.title} className="rounded-[1.6rem] border border-stone-200 bg-stone-50/70 p-5">
                  <h3 className="text-base font-bold text-ink-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow="How ordering works"
              title="A simple process for urgent repairs and regular service jobs"
              description="Customers usually come with a part name, a vehicle, or a photo reference. Simon handles the next step from there."
            />
            <div className="mt-6 grid gap-4">
              {orderingSteps.map((step, index) => (
                <div key={step.title} className="card-surface rounded-[1.6rem] p-5">
                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-extrabold text-brand-700">
                      0{index + 1}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-ink-900">{step.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-ink-600">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.6rem] border border-emerald-200 bg-emerald-50 px-5 py-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-bold text-ink-900">Trusted for quick sourcing support</p>
                  <p className="mt-1 text-sm leading-6 text-ink-600">
                    Useful for daily drivers, garages, and anyone trying to confirm the right part before buying.
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
            <div className="grid gap-4 rounded-[1.8rem] border border-stone-200 bg-[linear-gradient(135deg,#111827_0%,#1f2937_100%)] px-5 py-6 text-white shadow-[0_24px_60px_-38px_rgba(15,23,42,0.8)] sm:px-6 lg:grid-cols-[1fr,auto] lg:items-center">
              <div className="max-w-xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-200">Need help fast?</p>
                <h2 className="mt-2 text-[1.8rem] font-extrabold tracking-[-0.03em]">{homepageSettings.bottom_cta_heading}</h2>
                <p className="mt-2 text-sm leading-6 text-ink-200">{homepageSettings.bottom_cta_subtext}</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link to={buildCurrentRequestLink()}>
                  <Button variant="accent" size="lg" className="w-full sm:w-auto">
                    {homepageSettings.secondary_cta_text}
                  </Button>
                </Link>
                <a
                  href={buildWhatsAppLink('Hello Simon, I need help finding the right spare part for my vehicle.', siteSettings.whatsapp_number)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="secondary" size="lg" className="w-full bg-white text-ink-900 sm:w-auto">
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
