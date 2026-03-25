import { requireSupabase } from '@/lib/supabase';

export async function createPartRequest(values) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from('part_requests').insert({ ...values, status: 'new' }).select().single();
  if (error) throw error;
  return data;
}

export async function getPartRequests() {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from('part_requests').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function updatePartRequestStatus(id, status) {
  const supabase = requireSupabase();
  const { error } = await supabase.from('part_requests').update({ status }).eq('id', id);
  if (error) throw error;
  return { id, status };
}
