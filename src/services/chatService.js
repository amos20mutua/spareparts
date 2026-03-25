import { requireSupabase, supabase } from '@/lib/supabase';

const CHAT_SESSION_KEY = 'simon-chat-session';
const CHAT_PROFILE_KEY = 'simon-chat-profile';

export function getCustomerSessionId() {
  if (typeof window === 'undefined') return null;
  let sessionId = window.localStorage.getItem(CHAT_SESSION_KEY);
  if (!sessionId) {
    sessionId =
      typeof window.crypto?.randomUUID === 'function'
        ? window.crypto.randomUUID()
        : `chat-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(CHAT_SESSION_KEY, sessionId);
  }
  return sessionId;
}

export function getStoredChatProfile() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(CHAT_PROFILE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveStoredChatProfile(profile) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CHAT_PROFILE_KEY, JSON.stringify(profile));
}

export async function getConversationBySession(sessionId) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('chat_conversations')
    .select('*')
    .eq('customer_session_id', sessionId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createConversation(values) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('chat_conversations')
    .insert({
      customer_name: values.customer_name,
      customer_phone: values.customer_phone || null,
      customer_email: values.customer_email || null,
      customer_session_id: values.customer_session_id,
      status: values.status || 'open',
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateConversation(conversationId, values) {
  const client = requireSupabase();
  const { error } = await client
    .from('chat_conversations')
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq('id', conversationId);
  if (error) throw error;
  return { id: conversationId, ...values };
}

export async function getConversationMessages(conversationId) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('chat_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at');
  if (error) throw error;
  return data;
}

export async function sendChatMessage({ conversationId, senderType, message }) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('chat_messages')
    .insert({
      conversation_id: conversationId,
      sender_type: senderType,
      message,
      is_read: senderType === 'owner',
    })
    .select()
    .single();
  if (error) throw error;

  await client
    .from('chat_conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId);

  return data;
}

export async function markMessagesAsRead(conversationId, recipientType) {
  const client = requireSupabase();
  const senderType = recipientType === 'owner' ? 'customer' : 'owner';
  const { error } = await client
    .from('chat_messages')
    .update({ is_read: true })
    .eq('conversation_id', conversationId)
    .eq('sender_type', senderType)
    .eq('is_read', false);
  if (error) throw error;
}

export async function getAdminChatSnapshot() {
  const client = requireSupabase();
  const [{ data: conversations, error: conversationsError }, { data: messages, error: messagesError }] = await Promise.all([
    client.from('chat_conversations').select('*').order('updated_at', { ascending: false }),
    client.from('chat_messages').select('*').order('created_at'),
  ]);

  if (conversationsError) throw conversationsError;
  if (messagesError) throw messagesError;

  return {
    conversations,
    messages,
  };
}

export function subscribeToConversationMessages(conversationId, onChange) {
  if (!supabase) return () => {};
  const channel = supabase
    .channel(`chat-conversation-${conversationId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'chat_messages', filter: `conversation_id=eq.${conversationId}` },
      onChange,
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToAdminChats(onChange) {
  if (!supabase) return () => {};
  const channel = supabase
    .channel('admin-chats')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_conversations' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages' }, onChange)
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
