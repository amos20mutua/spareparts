import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useToast } from '@/hooks/useToast';
import { saveSiteSettings } from '@/services/settingsService';
import { uploadSiteAsset } from '@/services/storageService';
import { getErrorMessage } from '@/lib/utils';
import AdminImageField from '@/features/admin/components/AdminImageField';
import AdminPageHeader from '@/features/admin/components/AdminPageHeader';
import AdminSectionCard from '@/features/admin/components/AdminSectionCard';

export default function AdminSiteSettingsPage() {
  const { siteSettings, reloadContent } = useSiteContent();
  const [form, setForm] = useState(siteSettings);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setForm(siteSettings);
  }, [siteSettings]);

  const handleUpload = async (file, folder, setUploading) => {
    try {
      setUploading(true);
      return await uploadSiteAsset(file, folder);
    } catch (error) {
      showToast({ title: 'Upload failed', description: getErrorMessage(error), tone: 'error' });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      await saveSiteSettings(form);
      await reloadContent();
      showToast({ title: 'Site settings saved', description: 'Branding and contact details are now updated.' });
    } catch (error) {
      showToast({ title: 'Save failed', description: getErrorMessage(error), tone: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Site settings" description="Control the brand, contact details, and core business info." />

      <form className="space-y-6" onSubmit={handleSubmit}>
        <AdminSectionCard title="Business details" description="Keep the main brand details short, clear, and consistent.">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="label-base">Business name</label>
              <input className="input-base" value={form.business_name || ''} onChange={(event) => setForm((current) => ({ ...current, business_name: event.target.value }))} />
            </div>
            <div>
              <label className="label-base">Tagline</label>
              <input className="input-base" value={form.tagline || ''} onChange={(event) => setForm((current) => ({ ...current, tagline: event.target.value }))} />
            </div>
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Brand assets" description="Use clear images with strong contrast.">
          <div className="grid gap-6">
            <AdminImageField
              label="Logo"
              value={form.logo_url}
              onChange={(value) => setForm((current) => ({ ...current, logo_url: value }))}
              uploading={uploadingLogo}
              onUpload={(file) => handleUpload(file, 'logos', setUploadingLogo)}
              helperText="Best for the visible brand mark in the header. If left blank, the favicon image will be used there."
            />
            <AdminImageField
              label="Favicon"
              value={form.favicon_url}
              onChange={(value) => setForm((current) => ({ ...current, favicon_url: value }))}
              uploading={uploadingFavicon}
              onUpload={(file) => handleUpload(file, 'favicons', setUploadingFavicon)}
              helperText="Used for browser tabs, phone shortcuts, and as the header mark fallback when no logo is set."
            />
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Contact details" description="These details are used across the live site.">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="label-base">Phone</label>
              <input className="input-base" value={form.contact_phone || ''} onChange={(event) => setForm((current) => ({ ...current, contact_phone: event.target.value }))} />
            </div>
            <div>
              <label className="label-base">WhatsApp number</label>
              <input className="input-base" value={form.whatsapp_number || ''} onChange={(event) => setForm((current) => ({ ...current, whatsapp_number: event.target.value }))} />
            </div>
            <div>
              <label className="label-base">Email</label>
              <input className="input-base" value={form.email || ''} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
            </div>
            <div>
              <label className="label-base">Location</label>
              <input className="input-base" value={form.location || ''} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} />
            </div>
          </div>

          <div className="mt-5">
            <label className="label-base">Opening hours</label>
            <textarea
              className="input-base min-h-32"
              value={(form.opening_hours || []).join('\n')}
              onChange={(event) => setForm((current) => ({ ...current, opening_hours: event.target.value.split('\n') }))}
            />
            <p className="mt-2 text-xs text-ink-500">One line per entry.</p>
          </div>
        </AdminSectionCard>

        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save site settings'}
        </Button>
      </form>
    </div>
  );
}
