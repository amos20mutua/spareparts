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
            <ImageWithFallback src={value} alt={label} className="h-full w-full object-cover" />
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
        </div>
      </div>
    </div>
  );
}
