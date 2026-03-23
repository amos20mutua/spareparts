import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { getParts } from '@/services/partsService';
import { saveHomepageSettings } from '@/services/settingsService';
import { uploadSiteAsset } from '@/services/storageService';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/lib/utils';
import AdminImageField from '@/features/admin/components/AdminImageField';
import AdminPageHeader from '@/features/admin/components/AdminPageHeader';
import AdminSectionCard from '@/features/admin/components/AdminSectionCard';

export default function AdminHomepagePage() {
  const { homepageSettings, reloadContent } = useSiteContent();
  const [form, setForm] = useState(homepageSettings);
  const [products, setProducts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setForm(homepageSettings);
  }, [homepageSettings]);

  useEffect(() => {
    getParts().then(setProducts);
  }, []);

  const toggleProduct = (id) => {
    setForm((current) => {
      const exists = current.featured_product_ids.includes(id);
      return {
        ...current,
        featured_product_ids: exists ? current.featured_product_ids.filter((item) => item !== id) : [...current.featured_product_ids, id].slice(0, 4),
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      await saveHomepageSettings(form);
      await reloadContent();
      showToast({ title: 'Homepage updated', description: 'The live homepage content has been refreshed.' });
    } catch (error) {
      showToast({ title: 'Save failed', description: getErrorMessage(error), tone: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Homepage" description="Edit the hero, trust strip, featured products, and bottom CTA." />

      <form className="space-y-6" onSubmit={handleSubmit}>
        <AdminSectionCard title="Hero content" description="Keep the message short and search-first.">
          <div className="grid gap-5">
            <div>
              <label className="label-base">Hero heading</label>
              <input className="input-base" value={form.hero_heading || ''} onChange={(event) => setForm((current) => ({ ...current, hero_heading: event.target.value }))} />
            </div>
            <div>
              <label className="label-base">Hero subheading</label>
              <textarea className="input-base min-h-28" value={form.hero_subheading || ''} onChange={(event) => setForm((current) => ({ ...current, hero_subheading: event.target.value }))} />
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="label-base">Search placeholder</label>
                <input className="input-base" value={form.search_placeholder || ''} onChange={(event) => setForm((current) => ({ ...current, search_placeholder: event.target.value }))} />
              </div>
              <div>
                <label className="label-base">Primary CTA text</label>
                <input className="input-base" value={form.primary_cta_text || ''} onChange={(event) => setForm((current) => ({ ...current, primary_cta_text: event.target.value }))} />
              </div>
              <div>
                <label className="label-base">Secondary CTA text</label>
                <input className="input-base" value={form.secondary_cta_text || ''} onChange={(event) => setForm((current) => ({ ...current, secondary_cta_text: event.target.value }))} />
              </div>
            </div>
            <AdminImageField
              label="Hero background image"
              value={form.hero_background_image}
              onChange={(value) => setForm((current) => ({ ...current, hero_background_image: value }))}
              uploading={uploadingHero}
              onUpload={async (file) => {
                try {
                  setUploadingHero(true);
                  return await uploadSiteAsset(file, 'hero');
                } catch (error) {
                  showToast({ title: 'Upload failed', description: getErrorMessage(error), tone: 'error' });
                  return null;
                } finally {
                  setUploadingHero(false);
                }
              }}
              helperText="Use a wide automotive image with clean contrast."
            />
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Trust strip" description="Use four short points max.">
          <div className="space-y-4">
            <label className="inline-flex items-center gap-3 rounded-2xl border border-ink-200 bg-ink-50 px-4 py-3">
              <input type="checkbox" checked={Boolean(form.show_trust_strip)} onChange={(event) => setForm((current) => ({ ...current, show_trust_strip: event.target.checked }))} />
              <span className="text-sm font-semibold text-ink-700">Show trust strip</span>
            </label>
            <textarea
              className="input-base min-h-32"
              value={(form.trust_items || []).join('\n')}
              onChange={(event) => setForm((current) => ({ ...current, trust_items: event.target.value.split('\n') }))}
            />
            <p className="text-xs text-ink-500">One line per item. Keep each line short.</p>
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Featured products" description="Choose up to four products for the homepage.">
          <div className="space-y-4">
            <label className="inline-flex items-center gap-3 rounded-2xl border border-ink-200 bg-ink-50 px-4 py-3">
              <input type="checkbox" checked={Boolean(form.show_featured_products)} onChange={(event) => setForm((current) => ({ ...current, show_featured_products: event.target.checked }))} />
              <span className="text-sm font-semibold text-ink-700">Show featured products</span>
            </label>
            <div className="grid gap-3 md:grid-cols-2">
              {products.map((product) => (
                <label key={product.id} className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3">
                  <input type="checkbox" checked={form.featured_product_ids.includes(product.id)} onChange={() => toggleProduct(product.id)} />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-ink-900">{product.name}</span>
                    <span className="mt-1 block text-xs text-ink-500">
                      {product.vehicle_make} {product.vehicle_model}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Bottom CTA" description="Keep the final push simple and direct.">
          <div className="space-y-4">
            <label className="inline-flex items-center gap-3 rounded-2xl border border-ink-200 bg-ink-50 px-4 py-3">
              <input type="checkbox" checked={Boolean(form.show_bottom_cta)} onChange={(event) => setForm((current) => ({ ...current, show_bottom_cta: event.target.checked }))} />
              <span className="text-sm font-semibold text-ink-700">Show bottom CTA</span>
            </label>
            <div>
              <label className="label-base">CTA heading</label>
              <input className="input-base" value={form.bottom_cta_heading || ''} onChange={(event) => setForm((current) => ({ ...current, bottom_cta_heading: event.target.value }))} />
            </div>
            <div>
              <label className="label-base">CTA subtext</label>
              <textarea className="input-base min-h-28" value={form.bottom_cta_subtext || ''} onChange={(event) => setForm((current) => ({ ...current, bottom_cta_subtext: event.target.value }))} />
            </div>
          </div>
        </AdminSectionCard>

        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save homepage'}
        </Button>
      </form>
    </div>
  );
}
