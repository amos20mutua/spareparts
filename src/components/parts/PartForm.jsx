import { useEffect, useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { conditionOptions, stockOptions } from '@/lib/constants';

export default function PartForm({ initialValues, categories, onSubmit, loading, uploadingImage }) {
  const [values, setValues] = useState(initialValues);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    setValues(initialValues);
    setSelectedFile(null);
  }, [initialValues]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl('');
      return undefined;
    }

    const nextPreviewUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(nextPreviewUrl);

    return () => {
      URL.revokeObjectURL(nextPreviewUrl);
    };
  }, [selectedFile]);

  const activeImage = useMemo(() => previewUrl || values.image_url || '', [previewUrl, values.image_url]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(values, selectedFile);
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
        <input className="input-base" name="image_url" value={values.image_url || ''} onChange={handleChange} placeholder="Optional: paste a direct image URL" />
        <p className="mt-2 text-xs text-ink-500">You do not need to fill this if you are selecting an image from your device below.</p>
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl border border-stone-200 bg-stone-50">
        <div className="aspect-[16/10] bg-stone-100">
          {activeImage ? (
            <ImageWithFallback src={activeImage} alt={values.name || 'Product preview'} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center">
              <div>
                <p className="text-sm font-bold text-ink-700">No image attached yet</p>
                <p className="mt-2 text-sm leading-6 text-ink-500">Choose an image from your device or paste a direct image URL.</p>
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-stone-200 px-4 py-3">
          <p className="text-sm font-semibold text-ink-900">
            {selectedFile ? `Selected file: ${selectedFile.name}` : activeImage ? 'Current product image preview' : 'No image attached yet'}
          </p>
          <p className="mt-1 text-xs leading-5 text-ink-500">
            {selectedFile
              ? 'This file will upload to Supabase Storage automatically when you save the product.'
              : activeImage
                ? 'This is the image that will appear on the public site after you save the product.'
                : 'If you save without an image, the public site will show a clean no-image state.'}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <label className="label-base">Upload image from your device</label>
        <input
          className="input-base"
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0] || null;
            setSelectedFile(file);
          }}
        />
        <p className="mt-2 text-xs text-ink-500">
          {uploadingImage ? 'Uploading image to Supabase Storage...' : 'Select a file, then click Save part. The system will upload it automatically.'}
        </p>
        {selectedFile ? (
          <button
            type="button"
            className="mt-3 inline-flex rounded-xl border border-stone-300 px-3 py-2 text-sm font-semibold text-ink-700 transition hover:border-rose-200 hover:text-rose-700"
            onClick={() => setSelectedFile(null)}
          >
            Remove selected file
          </button>
        ) : null}
        {values.image_url || selectedFile ? (
          <button
            type="button"
            className="mt-3 ml-2 inline-flex rounded-xl border border-stone-300 px-3 py-2 text-sm font-semibold text-ink-700 transition hover:border-rose-200 hover:text-rose-700"
            onClick={() => {
              setSelectedFile(null);
              setValues((current) => ({ ...current, image_url: '' }));
            }}
          >
            Clear image
          </button>
        ) : null}
      </div>

      <div className="mt-5">
        <label className="label-base">Description</label>
        <textarea className="input-base min-h-36" name="description" value={values.description || ''} onChange={handleChange} />
      </div>

      <Button type="submit" className="mt-6" disabled={loading || uploadingImage}>
        {uploadingImage ? 'Uploading image and saving...' : loading ? 'Saving...' : 'Save part'}
      </Button>
    </form>
  );
}
