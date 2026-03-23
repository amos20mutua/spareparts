import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import SearchFilterBar from '@/components/parts/SearchFilterBar';
import PartCard from '@/components/parts/PartCard';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { getCategories } from '@/services/categoriesService';
import { getParts } from '@/services/partsService';
import { buildRequestQuery, matchesKeywordSearch, scoreKeywordMatch, shuffleBySeed } from '@/lib/utils';

const popularMakes = ['Toyota', 'Nissan', 'Mazda', 'Subaru', 'Honda'];
const INITIAL_VISIBLE = 9;
const LOAD_MORE_COUNT = 6;

function createMixSeed() {
  const now = new Date();
  const dayKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  const hourBucket = Math.floor(now.getHours() / 6);
  return `${dayKey}-${hourBucket}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function PartsCatalogPage() {
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [parts, setParts] = useState([]);
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
    <div className="container-shell py-10 sm:py-12">
      <div className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr] lg:items-end">
        <SectionHeading
          eyebrow="Parts Catalog"
          title="Search by part, vehicle, or keywords"
          description="Use direct keywords, vehicle details, or filters to narrow the right match faster."
        />
        <div className="card-surface rounded-[1.7rem] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-ink-900">Popular makes</p>
            <button type="button" className="inline-flex items-center gap-2 text-xs font-semibold text-brand-700 hover:text-brand-800" onClick={() => setMixSeed(createMixSeed())}>
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh mix
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {popularMakes.map((make) => (
              <button
                key={make}
                type="button"
                className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
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
        </div>
      </div>

      <div className="mt-6">
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

      {(vehicleMake || vehicleModel || vehicleYear) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {vehicleMake ? <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">{vehicleMake}</span> : null}
          {vehicleModel ? <span className="rounded-full bg-stone-200 px-3 py-1 text-sm font-semibold text-ink-700">{vehicleModel}</span> : null}
          {vehicleYear ? <span className="rounded-full bg-stone-200 px-3 py-1 text-sm font-semibold text-ink-700">{vehicleYear}</span> : null}
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3 rounded-[1.4rem] bg-stone-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-ink-700">
          {filteredParts.length} {filteredParts.length === 1 ? 'part' : 'parts'} found
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-ink-700 transition hover:border-brand-200 hover:text-brand-700" onClick={() => setMixSeed(createMixSeed())}>
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

      <div className="mt-6">
        {filteredParts.length ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleParts.map((part) => (
                <PartCard key={`${mixSeed}-${part.id}`} part={part} />
              ))}
            </div>
            {hasMore ? (
              <div className="mt-6 flex justify-center">
                <Button variant="secondary" onClick={() => setVisibleCount((current) => current + LOAD_MORE_COUNT)}>
                  View more parts
                </Button>
              </div>
            ) : null}
          </>
        ) : (
          <EmptyState
            title="No parts matched those filters"
            description="Try another keyword, change the mix, or request the exact part so Simon can help source it."
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
