import { requireSupabase } from '@/lib/supabase';
import { sampleCategories } from '@/data/sampleData';
import { slugify } from '@/lib/utils';

export async function getCategories() {
  try {
    const supabase = requireSupabase();
    const { data, error } = await supabase.from('categories').select('*').order('homepage_order', { ascending: true }).order('name');
    if (error) throw error;
    return data;
  } catch {
    return sampleCategories;
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
