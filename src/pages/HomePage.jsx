import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, MessageCircleMore, PhoneCall, Search, ShieldCheck, Truck, Wrench } from 'lucide-react';
import { getParts } from '@/services/partsService';
import { buildPartsQuery, buildRequestQuery, buildWhatsAppLink, formatCurrency } from '@/lib/utils';
import { useSiteContent } from '@/hooks/useSiteContent';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import VehicleSelector from '@/components/vehicles/VehicleSelector';
import VehicleSelectorModal from '@/components/vehicles/VehicleSelectorModal';

const initialVehicle = {
  make: '',
  model: '',
  year: '',
};

const quickShopFallbacks = [
  { title: 'Brake Parts', query: { search: 'brake pads' } },
  { title: 'Filters', query: { search: 'oil filter' } },
  { title: 'Body Parts', query: { search: 'mirror' } },
];

const trustIcons = [ShieldCheck, Wrench, MessageCircleMore, Truck, PhoneCall];

export default function HomePage() {
  const [featuredParts, setFeaturedParts] = useState([]);
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
  }, [homepageSettings.featured_product_ids]);

  const heroHint = useMemo(() => {
    if (vehicle.make && vehicle.model) {
      return `${vehicle.make} ${vehicle.model}${vehicle.year ? ` ${vehicle.year}` : ''}`;
    }
    return homepageSettings.search_placeholder;
  }, [homepageSettings.search_placeholder, vehicle]);

  const quickShopItems = useMemo(
    () =>
      quickShopFallbacks.map((item, index) => ({
        ...item,
        image: featuredParts[index]?.image_url || featuredParts[0]?.image_url || '',
      })),
    [featuredParts],
  );

  const trustItems = homepageSettings.trust_items.slice(0, 4);

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
    <div className="overflow-hidden pb-7 sm:pb-8">
      <section className="relative border-b border-stone-200 bg-ink-900">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={homepageSettings.hero_background_image}
            alt="Automotive spare parts and workshop tools"
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.4)_0%,rgba(15,23,42,0.66)_50%,rgba(15,23,42,0.8)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,77,164,0.28),transparent_34%)]" />
        </div>

        <div className="container-shell relative py-8 sm:py-10 lg:py-12">
          <div className="max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-200">{siteSettings.business_name}</p>
            <h1 className="mt-3 max-w-2xl text-[2rem] font-extrabold tracking-[-0.03em] text-white sm:text-[3.05rem] sm:leading-[0.98]">
              {homepageSettings.hero_heading}
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-7 text-stone-100 sm:text-base">{homepageSettings.hero_subheading}</p>

            <div className="mt-5 max-w-2xl rounded-[1.9rem] border border-white/60 bg-white/95 p-4 shadow-[0_26px_70px_-36px_rgba(15,23,42,0.8)] backdrop-blur sm:p-5">
              <label className="label-base text-ink-800">Search parts or enter vehicle</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  <input
                    className="input-base h-12 border-stone-300 bg-stone-50 pl-10"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    placeholder={`e.g. ${heroHint}`}
                  />
                </div>
                <Button className="h-12 px-5" onClick={handleSearchSubmit}>
                  Search
                </Button>
              </div>
              <VehicleSelector values={vehicle} onChange={handleVehicleChange} onSubmit={handleVehicleSubmit} submitLabel="Find Parts" className="mt-3" />
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <button type="button" onClick={() => setIsVehicleModalOpen(true)} className="font-semibold text-brand-700 hover:text-brand-800">
                  Use step-by-step vehicle picker
                </button>
                <Link to={buildCurrentRequestLink()} className="font-semibold text-ink-700 hover:text-brand-700">
                  {homepageSettings.secondary_cta_text}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {homepageSettings.show_trust_strip ? (
        <section className="border-b border-stone-200 bg-white">
          <div className="container-shell py-3.5">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {trustItems.map((item, index) => {
                const Icon = trustIcons[index % trustIcons.length];
                return (
                  <div key={item} className="flex items-center gap-2.5 text-sm text-ink-700">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-brand-700">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="font-semibold">{item}</span>
                    {index < trustItems.length - 1 ? <span className="hidden text-stone-300 md:inline">/</span> : null}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-white py-4 sm:hidden">
        <div className="container-shell">
          <div className="grid grid-cols-3 gap-3">
            {quickShopItems.map((item) => (
              <Link key={item.title} to={buildPartsQuery(item.query)} className="group">
                <div className="overflow-hidden rounded-2xl border border-stone-300 bg-white shadow-[0_10px_24px_-18px_rgba(15,23,42,0.3)]">
                  <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                    <ImageWithFallback src={item.image} alt={item.title} loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                  </div>
                  <div className="p-3">
                    <p className="min-h-[2.5rem] text-[12px] font-bold uppercase leading-4 tracking-[0.08em] text-ink-900">{item.title}</p>
                    <span className="mt-2 inline-flex rounded-md bg-brand-700 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-white">
                      Shop Now
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {homepageSettings.show_featured_products ? (
        <section className="bg-stone-50 py-6 sm:py-8">
          <div className="container-shell">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-700">Featured Products</p>
                <h2 className="mt-2 text-[1.6rem] font-extrabold tracking-[-0.03em] text-ink-900 sm:text-[1.9rem]">Popular parts ready for quick checks.</h2>
              </div>
              <Link to="/parts" className="hidden items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800 sm:inline-flex">
                {homepageSettings.primary_cta_text}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 sm:hidden">
              {featuredParts.map((part) => (
                <div key={part.id} className="flex h-full flex-col rounded-[1.5rem] border border-stone-300 bg-white p-3 shadow-[0_10px_24px_-20px_rgba(15,23,42,0.25)]">
                  <Link to={`/parts/${part.slug}`} className="flex h-full flex-col">
                    <div className="aspect-[4/3] overflow-hidden rounded-[1rem] bg-stone-100">
                      <ImageWithFallback src={part.image_url} alt={part.name} loading="lazy" className="h-full w-full object-cover" />
                    </div>
                    <div className="mt-3 flex flex-1 flex-col">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-700">{part.category?.name || 'Part'}</p>
                      <h3 className="mt-1 min-h-[2.8rem] text-[14px] font-extrabold leading-5 text-ink-900">{part.name}</h3>
                      <p className="mt-1 text-xs text-ink-500">
                        {part.vehicle_make} {part.vehicle_model}
                      </p>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <p className="text-[15px] font-extrabold tracking-tight text-ink-900">
                          {part.price_visible ? formatCurrency(part.price) : 'Request Price'}
                        </p>
                        <Badge className="shrink-0">{part.stock_status}</Badge>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-5 hidden overflow-hidden rounded-[2rem] border border-stone-300 bg-white sm:block">
              {featuredParts.map((part, index) => {
                const inquiryLink = buildWhatsAppLink(
                  `Hello Simon, I would like to inquire about ${part.name} for ${part.vehicle_make} ${part.vehicle_model}.`,
                  siteSettings.whatsapp_number,
                );

                return (
                  <div
                    key={part.id}
                    className={`grid gap-4 px-4 py-4 sm:px-5 lg:grid-cols-[110px,1.1fr,0.75fr,auto] lg:items-center ${
                      index !== featuredParts.length - 1 ? 'border-b border-stone-200' : ''
                    }`}
                  >
                    <div className="overflow-hidden rounded-[1.1rem] bg-stone-100">
                      <ImageWithFallback src={part.image_url} alt={part.name} loading="lazy" className="h-24 w-full object-cover lg:h-20" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">{part.category?.name || 'Part'}</p>
                      <h3 className="mt-1 text-base font-bold text-ink-900">{part.name}</h3>
                      <p className="mt-1 text-sm text-ink-600">
                        {part.vehicle_make} {part.vehicle_model}
                        {part.vehicle_year ? ` • ${part.vehicle_year}` : ''}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 lg:justify-between">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-500">Price</p>
                        <p className="mt-1 text-lg font-extrabold text-ink-900">
                          {part.price_visible ? formatCurrency(part.price) : 'Request Price'}
                        </p>
                      </div>
                      <Badge>{part.stock_status}</Badge>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                      <a href={inquiryLink} target="_blank" rel="noreferrer">
                        <Button size="sm" className="w-full sm:w-auto lg:w-full">
                          <MessageCircleMore className="h-4 w-4" />
                          Inquire
                        </Button>
                      </a>
                      <Link to={`/parts/${part.slug}`}>
                        <Button variant="secondary" size="sm" className="w-full sm:w-auto lg:w-full">
                          View Part
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {homepageSettings.show_bottom_cta ? (
        <section className="bg-white py-6 sm:py-8">
          <div className="container-shell">
            <div className="grid gap-4 border-l-4 border-brand-700 bg-[linear-gradient(135deg,#111827_0%,#1f2937_100%)] px-5 py-5 text-white shadow-[0_24px_60px_-38px_rgba(15,23,42,0.8)] sm:px-6 sm:py-6 lg:grid-cols-[1fr,auto] lg:items-center">
              <div className="max-w-xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-200">Request Flow</p>
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
                  href={buildWhatsAppLink('Hello Simon, I am looking for a vehicle spare part and would like assistance.', siteSettings.whatsapp_number)}
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
