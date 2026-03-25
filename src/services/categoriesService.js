import { requireSupabase } from '@/lib/supabase';
import { slugify } from '@/lib/utils';

export async function getCategories() {
  try {
    const supabase = requireSupabase();
    const { data, error } = await supabase.from('categories').select('*');
    if (error) throw error;
    return [...data].sort((first, second) => {
      const firstOrder = Number.isFinite(Number(first.homepage_order)) ? Number(first.homepage_order) : 9999;
      const secondOrder = Number.isFinite(Number(second.homepage_order)) ? Number(second.homepage_order) : 9999;
      if (firstOrder !== secondOrder) return firstOrder - secondOrder;
      return String(first.name || '').localeCompare(String(second.name || ''));
    });
  } catch {
    return [];
  }
}

export async function createCategory(values) {
  const supabase = requireSupabase();
  const payload = { ...values, slug: values.slug || slugify(values.name) };
  const { data, error } = await supabase.from('categories').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function updateCategory(id, values) {
  const supabase = requireSupabase();
  const payload = { ...values, slug: values.slug || slugify(values.name) };
  const { data, error } = await supabase.from('categories').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(id) {
  const supabase = requireSupabase();
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}
