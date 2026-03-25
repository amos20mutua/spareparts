import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/lib/utils';
import { listMediaAssets, uploadSiteAsset } from '@/services/storageService';
import AdminPageHeader from '@/features/admin/components/AdminPageHeader';
import AdminSectionCard from '@/features/admin/components/AdminSectionCard';

const folderOptions = [
  { value: 'general', label: 'General media' },
  { value: 'hero', label: 'Hero images' },
  { value: 'logos', label: 'Logos' },
  { value: 'favicons', label: 'Favicons' },
  { value: 'categories', label: 'Category images' },
];

export default function AdminMediaPage() {
  const [items, setItems] = useState([]);
  const [folder, setFolder] = useState('general');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadMedia = async () => {
    try {
      setLoading(true);
      setItems(await listMediaAssets());
    } catch (error) {
      showToast({ title: 'Could not load media', description: getErrorMessage(error), tone: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      await uploadSiteAsset(file, folder);
      await loadMedia();
      showToast({ title: 'Image uploaded', description: 'The new file is now available in the media library.' });
    } catch (error) {
      showToast({ title: 'Upload failed', description: getErrorMessage(error), tone: 'error' });
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Media library" description="Upload and reuse hero, logo, category, and general site images." />

      <AdminSectionCard title="Upload media" description="Store reusable images in one place.">
        <div className="grid gap-4 md:grid-cols-[220px,1fr] md:items-end">
          <div>
            <label className="label-base">Upload folder</label>
            <select className="input-base" value={folder} onChange={(event) => setFolder(event.target.value)}>
              {folderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-base">Select image</label>
            <input className="input-base" type="file" accept="image/*" onChange={handleUpload} />
            <p className="mt-2 text-xs text-ink-500">{uploading ? 'Uploading image...' : 'Uploads go to the site media bucket.'}</p>
          </div>
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Uploaded files" description="Copy any image URL to reuse it elsewhere in admin.">
        {loading ? (
          <p className="text-sm text-ink-500">Loading media...</p>
        ) : items.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl border border-ink-200 bg-white p-3">
                <div className="overflow-hidden rounded-2xl bg-ink-100">
                  <div className="aspect-[4/3]">
                    <ImageWithFallback src={item.url} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">{item.label}</p>
                <p className="mt-1 truncate text-sm font-semibold text-ink-900">{item.name}</p>
                <input className="input-base mt-3 text-xs" readOnly value={item.url} />
                <Button variant="secondary" size="sm" className="mt-3 w-full" onClick={() => navigator.clipboard.writeText(item.url)}>
                  Copy URL
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-500">No uploaded media yet.</p>
        )}
      </AdminSectionCard>
    </div>
  );
}
