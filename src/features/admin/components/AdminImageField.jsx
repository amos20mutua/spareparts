import ImageWithFallback from '@/components/ui/ImageWithFallback';

export default function AdminImageField({ label, value, onChange, onUpload, uploading, helperText }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="label-base">{label}</label>
        <input className="input-base" value={value || ''} onChange={(event) => onChange(event.target.value)} placeholder="Paste image URL or upload below" />
      </div>

      <div className="grid gap-4 md:grid-cols-[180px,1fr]">
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
          <div className="aspect-[4/3]">
            {value ? (
              <ImageWithFallback src={value} alt={label} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center px-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">No image selected</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="label-base">Upload image</label>
          <input
            className="input-base"
            type="file"
            accept="image/*"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file || !onUpload) return;
              const nextUrl = await onUpload(file);
              if (nextUrl) onChange(nextUrl);
            }}
          />
          <p className="mt-2 text-xs text-ink-500">{uploading ? 'Uploading image...' : helperText}</p>
          {value ? (
            <button
              type="button"
              className="mt-3 inline-flex rounded-xl border border-stone-300 px-3 py-2 text-sm font-semibold text-ink-700 transition hover:border-rose-200 hover:text-rose-700"
              onClick={() => onChange('')}
            >
              Remove image
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
