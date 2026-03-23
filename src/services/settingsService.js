import { defaultFooterSettings, defaultHomepageSettings, defaultSiteSettings } from '@/data/siteContent';
import { requireSupabase } from '@/lib/supabase';

function ensureStringArray(value, fallback) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return fallback;
}

function ensureIdArray(value, fallback = []) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }
  return fallback;
}

function normalizeSiteSettings(data) {
  return {
    ...defaultSiteSettings,
    ...(data || {}),
    opening_hours: ensureStringArray(data?.opening_hours, defaultSiteSettings.opening_hours),
  };
}

function normalizeHomepageSettings(data) {
  return {
    ...defaultHomepageSettings,
    ...(data || {}),
    trust_items: ensureStringArray(data?.trust_items, defaultHomepageSettings.trust_items),
    featured_product_ids: ensureIdArray(data?.featured_product_ids, defaultHomepageSettings.featured_product_ids),
  };
}

function normalizeFooterSettings(data) {
  return {
    ...defaultFooterSettings,
    ...(data || {}),
    business_hours: ensureStringArray(data?.business_hours, defaultFooterSettings.business_hours),
  };
}

async function getSingletonRecord(table, normalizer, fallback) {
  try {
    const supabase = requireSupabase();
    const { data, error } = await supabase.from(table).select('*').eq('id', 1).maybeSingle();
    if (error) throw error;
    return normalizer(data);
  } catch {
    return fallback;
  }
}

async function saveSingletonRecord(table, payload) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(table)
    .upsert({ id: 1, ...payload }, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getSiteSettings() {
  return getSingletonRecord('site_settings', normalizeSiteSettings, defaultSiteSettings);
}

export async function saveSiteSettings(values) {
  const payload = {
    ...values,
    opening_hours: ensureStringArray(values.opening_hours, []),
  };
  const data = await saveSingletonRecord('site_settings', payload);
  return normalizeSiteSettings(data);
}

export async function getHomepageSettings() {
  return getSingletonRecord('homepage_settings', normalizeHomepageSettings, defaultHomepageSettings);
}

export async function saveHomepageSettings(values) {
  const payload = {
    ...values,
    trust_items: ensureStringArray(values.trust_items, []),
    featured_product_ids: ensureIdArray(values.featured_product_ids, []),
  };
  const data = await saveSingletonRecord('homepage_settings', payload);
  return normalizeHomepageSettings(data);
}

export async function getFooterSettings() {
  return getSingletonRecord('footer_settings', normalizeFooterSettings, defaultFooterSettings);
}

export async function saveFooterSettings(values) {
  const payload = {
    ...values,
    business_hours: ensureStringArray(values.business_hours, []),
  };
  const data = await saveSingletonRecord('footer_settings', payload);
  return normalizeFooterSettings(data);
}

export async function getSiteContentSnapshot() {
  const [siteSettings, homepageSettings, footerSettings] = await Promise.all([
    getSiteSettings(),
    getHomepageSettings(),
    getFooterSettings(),
  ]);

  return { siteSettings, homepageSettings, footerSettings };
}
