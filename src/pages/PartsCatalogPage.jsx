import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import SearchFilterBar from '@/components/parts/SearchFilterBar';
import PartCard from '@/components/parts/PartCard';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import PageMeta from '@/components/ui/PageMeta';
import { getCategories } from '@/services/categoriesService';
import { getParts } from '@/services/partsService';
import { buildRequestQuery, matchesKeywordSearch, scoreKeywordMatch, shuffleBySeed } from '@/lib/utils';

const popularMakes = ['Toyota', 'Nissan', 'Mazda', 'Subaru', 'Honda'];
const INITIAL_VISIBLE = 8;
const LOAD_MORE_COUNT = 4;

function createMixSeed() {
  const now = new Date();
  const dayKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  const hourBucket = Math.floor(now.getHours() / 6);
  return `${dayKey}-${hourBucket}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function PartsCatalogPage() {
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [parts, setParts] = useState(null);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [vehicleMake, setVehicleMake] = useState(searchParams.get('make') || '');
  const [vehicleModel, setVehicleModel] = useState(searchParams.get('model') || '');
  const [vehicleYear, setVehicleYear] = useState(searchParams.get('year') || '');
  const [availability, setAvailability] = useState(searchParams.get('availability') || '');
  const [mixSeed, setMixSeed] = useState(createMixSeed);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  useEffect(() => {
    getCategories().then(setCategories);
    getParts().then(setParts);
  }, []);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [search, category, vehicleMake, vehicleModel, vehicleYear, availability, mixSeed]);

  const filteredParts = useMemo(() => {
    if (!parts) return [];

    const matched = parts.filter((part) => {
      const matchesSearch = search ? matchesKeywordSearch(part, search) : true;
      const matchesCategory = category ? String(part.category_id) === String(category) : true;
      const matchesMake = vehicleMake ? part.vehicle_make?.toLowerCase().includes(vehicleMake.toLowerCase()) : true;
      const matchesModel = vehicleModel ? part.vehicle_model?.toLowerCase().includes(vehicleModel.toLowerCase()) : true;
      const matchesYear = vehicleYear ? part.vehicle_year?.toLowerCase().includes(vehicleYear.toLowerCase()) : true;
      const matchesAvailability = availability ? part.stock_status === availability : true;
      return matchesSearch && matchesCategory && matchesMake && matchesModel && matchesYear && matchesAvailability;
    });

    const scored = matched.sort((first, second) => {
      const secondScore = scoreKeywordMatch(second, search);
      const firstScore = scoreKeywordMatch(first, search);
      if (secondScore !== firstScore) return secondScore - firstScore;
      return 0;
    });

    return shuffleBySeed(scored, mixSeed);
  }, [availability, category, mixSeed, parts, search, vehicleMake, vehicleModel, vehicleYear]);

  const visibleParts = filteredParts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredParts.length;

  return (
    <div className="container-shell py-6 sm:py-8 lg:py-10">
      <PageMeta title="Browse parts" description="Search spare parts by keyword, category, stock status, or vehicle details." />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Parts catalog"
          title="Search parts faster"
          description="Use a keyword, make, or stock filter to get to the right item quickly."
        />
        <Link
          to={buildRequestQuery({
            make: vehicleMake,
            model: vehicleModel,
            year: vehicleYear,
            part: search,
          })}
        >
          <Button size="sm">Request a part</Button>
        </Link>
      </div>

      <div className="mt-4">
        <SearchFilterBar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          vehicleMake={vehicleMake}
          setVehicleMake={setVehicleMake}
          availability={availability}
          setAvailability={setAvailability}
          categories={categories}
          onClear={() => {
            setSearch('');
            setCategory('');
            setVehicleMake('');
            setVehicleModel('');
            setVehicleYear('');
            setAvailability('');
            setMixSeed(createMixSeed());
          }}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {popularMakes.map((make) => (
          <button
            key={make}
            type="button"
            className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold transition ${
              vehicleMake === make
                ? 'border-brand-200 bg-brand-50 text-brand-700'
                : 'border-stone-300 bg-white text-ink-700 hover:border-brand-200 hover:text-brand-700'
            }`}
            onClick={() => setVehicleMake(make)}
          >
            {make}
          </button>
        ))}
      </div>

      {(vehicleMake || vehicleModel || vehicleYear) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {vehicleMake ? <span className="rounded-full bg-brand-50 px-3 py-1 text-[12px] font-semibold text-brand-700">{vehicleMake}</span> : null}
          {vehicleModel ? <span className="rounded-full bg-stone-200 px-3 py-1 text-[12px] font-semibold text-ink-700">{vehicleModel}</span> : null}
          {vehicleYear ? <span className="rounded-full bg-stone-200 px-3 py-1 text-[12px] font-semibold text-ink-700">{vehicleYear}</span> : null}
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2.5 rounded-[1.15rem] bg-stone-100 px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-ink-700">
          {filteredParts.length} {filteredParts.length === 1 ? 'part' : 'parts'} found
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-3 py-2 text-[13px] font-semibold text-ink-700 transition hover:border-brand-200 hover:text-brand-700"
            onClick={() => setMixSeed(createMixSeed())}
          >
            <RefreshCw className="h-4 w-4" />
            Change arrangement
          </button>
          <Link
            to={buildRequestQuery({
              make: vehicleMake,
              model: vehicleModel,
              year: vehicleYear,
              part: search,
            })}
          >
            <Button size="sm">Need help finding a part?</Button>
          </Link>
        </div>
      </div>

      <div className="mt-4">
        {parts === null ? (
          <LoadingState label="Loading catalog..." />
        ) : filteredParts.length ? (
          <>
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              {visibleParts.map((part) => (
                <PartCard key={`${mixSeed}-${part.id}`} part={part} />
              ))}
            </div>
            {hasMore ? (
              <div className="mt-5 flex justify-center">
                <Button variant="secondary" size="sm" onClick={() => setVisibleCount((current) => current + LOAD_MORE_COUNT)}>
                  View more parts
                </Button>
              </div>
            ) : null}
          </>
        ) : (
          <EmptyState
            title="No matching parts yet"
            description="Try a different keyword, clear a filter, or send the vehicle details so Simon can help source the right part."
            action={
              <Link
                to={buildRequestQuery({
                  make: vehicleMake,
                  model: vehicleModel,
                  year: vehicleYear,
                  part: search,
                })}
              >
                <Button>Request this part</Button>
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
