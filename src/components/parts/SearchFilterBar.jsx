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
  const quickKeywords = ['brake pads', 'oil filter', 'side mirror', 'headlamp', 'shock absorber'];

  return (
    <div className="card-surface rounded-[1.25rem] p-3 sm:p-4">
      <div className="mb-3 flex flex-col gap-2.5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-ink-900">Search faster</p>
          <p className="mt-1 text-xs leading-5 text-ink-500">Use a keyword, category, make, or stock filter.</p>
        </div>
        <Button variant="secondary" size="xs" className="sm:shrink-0" onClick={onClear}>
          Clear filters
        </Button>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-[2fr,1fr,1fr,1fr]">
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="label-base">Keyword</label>
          <input
            className="input-base"
            type="search"
            placeholder="Brake pads, projector headlamp, oil filter..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div>
          <label className="label-base">Category</label>
          <select className="input-base" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-base">Vehicle make</label>
          <input
            className="input-base"
            type="text"
            placeholder="Toyota, Nissan, Mazda..."
            value={vehicleMake}
            onChange={(event) => setVehicleMake(event.target.value)}
          />
        </div>
        <div>
          <label className="label-base">Availability</label>
          <select className="input-base" value={availability} onChange={(event) => setAvailability(event.target.value)}>
            <option value="">Any stock status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {quickKeywords.map((keyword) => (
          <button
            key={keyword}
            type="button"
            className="rounded-full border border-stone-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-ink-700 transition hover:border-brand-200 hover:text-brand-700 sm:px-3 sm:py-1.5 sm:text-xs"
            onClick={() => setSearch(keyword)}
          >
            {keyword}
          </button>
        ))}
      </div>
    </div>
  );
}
