import { requireSupabase } from '@/lib/supabase';

export async function createContactMessage(values) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from('contact_messages').insert(values).select().single();
  if (error) throw error;
  return data;
}

export async function getContactMessages() {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
