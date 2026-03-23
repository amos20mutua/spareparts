import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useToast } from '@/hooks/useToast';
import { saveFooterSettings } from '@/services/settingsService';
import { getErrorMessage } from '@/lib/utils';
import AdminPageHeader from '@/features/admin/components/AdminPageHeader';
import AdminSectionCard from '@/features/admin/components/AdminSectionCard';

export default function AdminFooterPage() {
  const { footerSettings, reloadContent } = useSiteContent();
  const [form, setForm] = useState(footerSettings);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setForm(footerSettings);
  }, [footerSettings]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      await saveFooterSettings(form);
      await reloadContent();
      showToast({ title: 'Footer saved', description: 'Footer content is now updated.' });
    } catch (error) {
      showToast({ title: 'Save failed', description: getErrorMessage(error), tone: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Footer" description="Edit the footer details and quick links block." />

      <form className="space-y-6" onSubmit={handleSubmit}>
        <AdminSectionCard title="Footer copy" description="Keep it brief and useful.">
          <div className="space-y-5">
            <div>
              <label className="label-base">Footer description</label>
              <textarea className="input-base min-h-28" value={form.description || ''} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
            </div>
            <label className="inline-flex items-center gap-3 rounded-2xl border border-ink-200 bg-ink-50 px-4 py-3">
              <input type="checkbox" checked={Boolean(form.show_quick_links)} onChange={(event) => setForm((current) => ({ ...current, show_quick_links: event.target.checked }))} />
              <span className="text-sm font-semibold text-ink-700">Show quick links</span>
            </label>
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Footer contact details" description="These details appear in the live footer.">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="label-base">Phone</label>
              <input className="input-base" value={form.phone || ''} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
            </div>
            <div>
              <label className="label-base">Email</label>
              <input className="input-base" value={form.email || ''} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <label className="label-base">Address</label>
              <input className="input-base" value={form.address || ''} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} />
            </div>
          </div>

          <div className="mt-5">
            <label className="label-base">Business hours</label>
            <textarea
              className="input-base min-h-32"
              value={(form.business_hours || []).join('\n')}
              onChange={(event) => setForm((current) => ({ ...current, business_hours: event.target.value.split('\n') }))}
            />
            <p className="mt-2 text-xs text-ink-500">One line per entry.</p>
          </div>
        </AdminSectionCard>

        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save footer'}
        </Button>
      </form>
    </div>
  );
}
