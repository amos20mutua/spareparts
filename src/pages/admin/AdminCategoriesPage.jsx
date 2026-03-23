import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import { createCategory, deleteCategory, getCategories, updateCategory } from '@/services/categoriesService';
import { uploadCategoryImage } from '@/services/storageService';
import { getErrorMessage, slugify } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import AdminImageField from '@/features/admin/components/AdminImageField';
import AdminPageHeader from '@/features/admin/components/AdminPageHeader';
import AdminSectionCard from '@/features/admin/components/AdminSectionCard';

const defaultForm = {
  id: null,
  name: '',
  slug: '',
  description: '',
  image_url: '',
  show_on_homepage: false,
  homepage_order: 0,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const payload = {
        name: form.name,
        slug: form.slug || slugify(form.name),
        description: form.description,
        image_url: form.image_url,
        show_on_homepage: Boolean(form.show_on_homepage),
        homepage_order: Number(form.homepage_order || 0),
      };
      if (form.id) {
        await updateCategory(form.id, payload);
      } else {
        await createCategory(payload);
      }
      await loadCategories();
      setForm(defaultForm);
      showToast({ title: 'Category saved', description: 'The category list has been updated.' });
    } catch (error) {
      showToast({ title: 'Save failed', description: getErrorMessage(error), tone: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      await loadCategories();
      showToast({ title: 'Category deleted' });
    } catch (error) {
      showToast({ title: 'Delete failed', description: getErrorMessage(error), tone: 'error' });
    }
  };

  const handleImageUpload = async (file) => {
    try {
      setUploading(true);
      return await uploadCategoryImage(file);
    } catch (error) {
      showToast({ title: 'Image upload failed', description: getErrorMessage(error), tone: 'error' });
      return null;
    } finally {
      setUploading(false);
    }
  };

  if (!categories) {
    return <LoadingState label="Loading categories..." />;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr,1.08fr]">
      <div className="space-y-6">
        <AdminPageHeader title={form.id ? 'Edit category' : 'Add category'} description="Control category copy, image, and homepage settings." />
        <form className="space-y-6" onSubmit={handleSubmit}>
          <AdminSectionCard title="Category details">
            <div className="grid gap-5">
              <div>
                <label className="label-base">Name</label>
                <input className="input-base" value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} />
              </div>
              <div>
                <label className="label-base">Slug</label>
                <input className="input-base" value={form.slug} onChange={(e) => setForm((current) => ({ ...current, slug: e.target.value }))} />
              </div>
              <div>
                <label className="label-base">Description</label>
                <textarea className="input-base min-h-28" value={form.description} onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))} />
              </div>
            </div>
          </AdminSectionCard>

          <AdminSectionCard title="Category image">
            <AdminImageField
              label="Image"
              value={form.image_url}
              onChange={(value) => setForm((current) => ({ ...current, image_url: value }))}
              onUpload={handleImageUpload}
              uploading={uploading}
              helperText="Use this for category cards and future homepage sections."
            />
          </AdminSectionCard>

          <AdminSectionCard title="Homepage settings">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="inline-flex items-center gap-3 rounded-2xl border border-ink-200 bg-ink-50 px-4 py-3">
                <input
                  type="checkbox"
                  checked={Boolean(form.show_on_homepage)}
                  onChange={(event) => setForm((current) => ({ ...current, show_on_homepage: event.target.checked }))}
                />
                <span className="text-sm font-semibold text-ink-700">Show on homepage</span>
              </label>
              <div>
                <label className="label-base">Homepage order</label>
                <input
                  className="input-base"
                  type="number"
                  min="0"
                  value={form.homepage_order}
                  onChange={(event) => setForm((current) => ({ ...current, homepage_order: event.target.value }))}
                />
              </div>
            </div>
          </AdminSectionCard>

          <Button type="submit" disabled={saving}>
            <Plus className="h-4 w-4" />
            {saving ? 'Saving...' : form.id ? 'Update category' : 'Add category'}
          </Button>
        </form>
      </div>

      <AdminSectionCard title="Current categories" description="Keep the list tidy and order homepage visibility here.">
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="rounded-3xl border border-ink-100 bg-ink-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-lg font-bold text-ink-900">{category.name}</p>
                    {category.show_on_homepage ? (
                      <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-700">Homepage</span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-ink-500">{category.slug}</p>
                  <p className="mt-3 text-sm leading-7 text-ink-600">{category.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setForm({ ...defaultForm, ...category })}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => handleDelete(category.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AdminSectionCard>
    </div>
  );
}
