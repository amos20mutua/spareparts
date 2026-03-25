import { requireSupabase } from '@/lib/supabase';
import { sampleCategories, sampleParts } from '@/data/sampleData';
import { matchesKeywordSearch, shuffleBySeed, slugify } from '@/lib/utils';

function decoratePart(part) {
  if (part.category) return part;
  const category =
    sampleCategories.find((item) => item.id === String(part.category_id)) ||
    sampleCategories.find((item) => item.id === part.category_id);
  return { ...part, category };
}

function normalizePartPayload(values) {
  return {
    ...values,
    category_id: values.category_id ? values.category_id : null,
    is_active: values.is_active ?? true,
    image_url: typeof values.image_url === 'string' ? values.image_url.trim() : '',
  };
}

function buildSlugCandidates(values) {
  const candidates = [
    slugify(values.slug),
    slugify([values.name, values.vehicle_make, values.vehicle_model, values.vehicle_year].filter(Boolean).join(' ')),
    slugify([values.name, values.vehicle_make, values.vehicle_model].filter(Boolean).join(' ')),
    slugify([values.name, values.vehicle_make].filter(Boolean).join(' ')),
    slugify(values.name),
  ].filter(Boolean);

  return [...new Set(candidates)];
}

async function generateUniqueSlug(supabase, values, currentId = null) {
  const candidates = buildSlugCandidates(values);

  for (const candidate of candidates) {
    let query = supabase.from('parts').select('id').eq('slug', candidate);
    if (currentId) query = query.neq('id', currentId);
    const { data, error } = await query.maybeSingle();
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return candidate;
  }

  const baseSlug = candidates[candidates.length - 1] || `part-${Date.now()}`;

  for (let index = 2; index < 1000; index += 1) {
    const nextSlug = `${baseSlug}-${index}`;
    let query = supabase.from('parts').select('id').eq('slug', nextSlug);
    if (currentId) query = query.neq('id', currentId);
    const { data, error } = await query.maybeSingle();
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return nextSlug;
  }

  return `${baseSlug}-${Date.now()}`;
}

export async function getParts(filters = {}) {
  const shuffleSeed = filters.shuffleSeed || '';
  try {
    const supabase = requireSupabase();
    let query = supabase.from('parts').select('*, category:categories(*)');
    if (filters.category) query = query.eq('category_id', filters.category);
    if (filters.vehicleMake) query = query.ilike('vehicle_make', `%${filters.vehicleMake}%`);
    if (filters.availability) query = query.eq('stock_status', filters.availability);
    if (filters.featuredOnly) query = query.eq('featured', true);

    const { data, error } = await query;
    if (error) throw error;

    let items = data.filter((part) => (filters.includeInactive ? true : part.is_active !== false));
    if (filters.search) {
      items = items.filter((part) => matchesKeywordSearch(part, filters.search));
    }
    return shuffleSeed ? shuffleBySeed(items, shuffleSeed) : items;
  } catch {
    const filtered = sampleParts.map(decoratePart).filter((part) => {
      const matchesCategory = filters.category ? String(part.category_id) === String(filters.category) : true;
      const matchesMake = filters.vehicleMake ? part.vehicle_make.toLowerCase().includes(filters.vehicleMake.toLowerCase()) : true;
      const matchesAvailability = filters.availability ? part.stock_status === filters.availability : true;
      const matchesFeatured = filters.featuredOnly ? part.featured : true;
      const matchesSearch = filters.search ? matchesKeywordSearch(part, filters.search) : true;
      const matchesActive = filters.includeInactive ? true : part.is_active !== false;
      return matchesCategory && matchesMake && matchesAvailability && matchesFeatured && matchesSearch && matchesActive;
    });
    return shuffleSeed ? shuffleBySeed(filtered, shuffleSeed) : filtered;
  }
}

export async function getPartBySlug(slug) {
  try {
    const supabase = requireSupabase();
    const { data, error } = await supabase.from('parts').select('*, category:categories(*)').eq('slug', slug).single();
    if (error) throw error;
    return data;
  } catch {
    return sampleParts.map(decoratePart).find((part) => part.slug === slug) || null;
  }
}

export async function getPartById(id) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from('parts').select('*, category:categories(*)').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createPart(values) {
  const supabase = requireSupabase();
  const payload = {
    ...normalizePartPayload(values),
    slug: await generateUniqueSlug(supabase, values),
  };
  const { data, error } = await supabase.from('parts').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function updatePart(id, values) {
  const supabase = requireSupabase();
  const payload = {
    ...normalizePartPayload(values),
    slug: await generateUniqueSlug(supabase, values, id),
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from('parts').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deletePart(id) {
  const supabase = requireSupabase();
  const { error } = await supabase.from('parts').delete().eq('id', id);
  if (error) throw error;
}
