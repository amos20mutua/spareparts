import Button from '@/components/ui/Button';

export default function SearchFilterBar({
  search,
  setSearch,
  category,
  setCategory,
  vehicleMake,
  setVehicleMake,
  availability,
  setAvailability,
  categories,
  onClear,
}) {
  const quickKeywords = ['brake pads', 'oil filter', 'mirror', 'headlamp', 'shock absorber'];

  return (
    <div className="card-surface rounded-[1.7rem] p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-ink-900">Find parts fast</p>
          <p className="text-xs leading-5 text-ink-500">Search by part, vehicle, category, stock, or keywords.</p>
        </div>
        <Button variant="secondary" size="sm" className="shrink-0" onClick={onClear}>
          Clear
        </Button>
      </div>
      <div className="grid gap-3 lg:grid-cols-[2fr,1fr,1fr,1fr]">
        <input
          className="input-base"
          type="search"
          placeholder="Brake pads, Toyota Axio, oil filter, headlamp..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select className="input-base" value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <input
          className="input-base"
          type="text"
          placeholder="Vehicle make"
          value={vehicleMake}
          onChange={(event) => setVehicleMake(event.target.value)}
        />
        <select className="input-base" value={availability} onChange={(event) => setAvailability(event.target.value)}>
          <option value="">Availability</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {quickKeywords.map((keyword) => (
          <button
            key={keyword}
            type="button"
            className="rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:border-brand-200 hover:text-brand-700"
            onClick={() => setSearch(keyword)}
          >
            {keyword}
          </button>
        ))}
      </div>
    </div>
  );
}
