import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { conditionOptions, stockOptions } from '@/lib/constants';

export default function PartForm({ initialValues, categories, onSubmit, loading, onImageUpload, uploadingImage }) {
  const [values, setValues] = useState(initialValues);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="card-surface rounded-3xl p-5 sm:p-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label-base">Part name</label>
          <input className="input-base" name="name" value={values.name || ''} onChange={handleChange} />
        </div>
        <div>
          <label className="label-base">Category</label>
          <select className="input-base" name="category_id" value={values.category_id || ''} onChange={handleChange}>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-base">Vehicle make</label>
          <input className="input-base" name="vehicle_make" value={values.vehicle_make || ''} onChange={handleChange} />
        </div>
        <div>
          <label className="label-base">Vehicle model</label>
          <input className="input-base" name="vehicle_model" value={values.vehicle_model || ''} onChange={handleChange} />
        </div>
        <div>
          <label className="label-base">Vehicle year</label>
          <input className="input-base" name="vehicle_year" value={values.vehicle_year || ''} onChange={handleChange} />
        </div>
        <div>
          <label className="label-base">Condition</label>
          <select className="input-base" name="condition" value={values.condition || 'New'} onChange={handleChange}>
            {conditionOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-base">Price (KES)</label>
          <input className="input-base" type="number" min="0" name="price" value={values.price ?? ''} onChange={handleChange} />
        </div>
        <div>
          <label className="label-base">Stock status</label>
          <select className="input-base" name="stock_status" value={values.stock_status || 'In Stock'} onChange={handleChange}>
            {stockOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <label className="inline-flex items-center gap-3 rounded-2xl border border-ink-200 bg-ink-50 px-4 py-3">
          <input type="checkbox" name="price_visible" checked={Boolean(values.price_visible)} onChange={handleChange} />
          <span className="text-sm font-semibold text-ink-700">Show price publicly</span>
        </label>
        <label className="inline-flex items-center gap-3 rounded-2xl border border-ink-200 bg-ink-50 px-4 py-3">
          <input type="checkbox" name="featured" checked={Boolean(values.featured)} onChange={handleChange} />
          <span className="text-sm font-semibold text-ink-700">Feature on homepage</span>
        </label>
        <label className="inline-flex items-center gap-3 rounded-2xl border border-ink-200 bg-ink-50 px-4 py-3 md:col-span-2">
          <input type="checkbox" name="is_active" checked={values.is_active !== false} onChange={handleChange} />
          <span className="text-sm font-semibold text-ink-700">Show this product on the website</span>
        </label>
      </div>
      <div className="mt-5">
        <label className="label-base">Image URL</label>
        <input className="input-base" name="image_url" value={values.image_url || ''} onChange={handleChange} />
      </div>
      <div className="mt-5">
        <label className="label-base">Upload image</label>
        <input
          className="input-base"
          type="file"
          accept="image/*"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file || !onImageUpload) return;
            const uploadedUrl = await onImageUpload(file);
            if (uploadedUrl) {
              setValues((current) => ({ ...current, image_url: uploadedUrl }));
            }
          }}
        />
        <p className="mt-2 text-xs text-ink-500">
          {uploadingImage
            ? 'Uploading image to Supabase Storage...'
            : 'Use this if you have created the public `part-images` bucket in Supabase.'}
        </p>
        {values.image_url ? <p className="mt-2 break-all text-xs text-brand-700">{values.image_url}</p> : null}
        {values.image_url ? (
          <button
            type="button"
            className="mt-3 inline-flex rounded-xl border border-stone-300 px-3 py-2 text-sm font-semibold text-ink-700 transition hover:border-rose-200 hover:text-rose-700"
            onClick={() => setValues((current) => ({ ...current, image_url: '' }))}
          >
            Remove image
          </button>
        ) : null}
      </div>
      <div className="mt-5">
        <label className="label-base">Description</label>
        <textarea className="input-base min-h-36" name="description" value={values.description || ''} onChange={handleChange} />
      </div>
      <Button type="submit" className="mt-6" disabled={loading}>
        {loading ? 'Saving...' : 'Save part'}
      </Button>
    </form>
  );
}
