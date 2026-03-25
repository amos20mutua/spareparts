import { useEffect, useMemo, useState } from 'react';
import { MessageCircleMore, Minus, X } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import {
  createConversation,
  getConversationBySession,
  getConversationMessages,
  getCustomerSessionId,
  getStoredChatProfile,
  markMessagesAsRead,
  saveStoredChatProfile,
  sendChatMessage,
  subscribeToConversationMessages,
  updateConversation,
} from '@/services/chatService';
import { getErrorMessage } from '@/lib/utils';
import ChatMessageList from './ChatMessageList';
import ChatComposer from './ChatComposer';

function getChatErrorMessage(error) {
  const message = getErrorMessage(error);
  if (message.toLowerCase().includes('row-level security')) {
    return 'Chat needs the Supabase chat policies from schema.sql. Use WhatsApp for now, then re-run the chat SQL setup.';
  }
  return message;
}

export default function ChatWidget({ open, onClose }) {
  const [minimized, setMinimized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [identity, setIdentity] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    first_message: '',
  });
  const { showToast } = useToast();
  const sessionId = useMemo(() => getCustomerSessionId(), []);

  const unreadCount = useMemo(
    () => messages.filter((message) => message.sender_type === 'owner' && !message.is_read).length,
    [messages],
  );

  useEffect(() => {
    if (!open || !sessionId) return undefined;
    let cancelled = false;

    const init = async () => {
      try {
        setLoading(true);
        const storedProfile = getStoredChatProfile();
        if (!cancelled) {
          setIdentity((current) => ({
            ...current,
            customer_name: storedProfile.customer_name || '',
            customer_phone: storedProfile.customer_phone || '',
            customer_email: storedProfile.customer_email || '',
          }));
        }
        const existingConversation = await getConversationBySession(sessionId);
        if (!existingConversation || cancelled) return;
        const conversationMessages = await getConversationMessages(existingConversation.id);
        if (cancelled) return;
        setConversation(existingConversation);
        setMessages(conversationMessages);
        await markMessagesAsRead(existingConversation.id, 'customer');
      } catch (error) {
        showToast({ title: 'Chat unavailable', description: getChatErrorMessage(error), tone: 'error' });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, [open, sessionId, showToast]);

  useEffect(() => {
    if (!conversation?.id) return undefined;
    return subscribeToConversationMessages(conversation.id, async () => {
      const updatedMessages = await getConversationMessages(conversation.id);
      setMessages(updatedMessages);
      if (open) {
        await markMessagesAsRead(conversation.id, 'customer');
      }
    });
  }, [conversation?.id, open]);

  useEffect(() => {
    if (open && conversation?.id) {
      markMessagesAsRead(conversation.id, 'customer').catch(() => {});
    }
  }, [conversation?.id, open]);

  const handleStartConversation = async (event) => {
    event.preventDefault();
    if (!identity.customer_name.trim() || (!identity.customer_phone.trim() && !identity.customer_email.trim()) || !identity.first_message.trim()) {
      showToast({
        title: 'Missing details',
        description: 'Add your name, phone or email, and the first message to start the chat.',
        tone: 'error',
      });
      return;
    }

    try {
      setSending(true);
      const createdConversation = await createConversation({
        customer_name: identity.customer_name,
        customer_phone: identity.customer_phone,
        customer_email: identity.customer_email,
        customer_session_id: sessionId,
      });
      await sendChatMessage({
        conversationId: createdConversation.id,
        senderType: 'customer',
        message: identity.first_message,
      });

      saveStoredChatProfile({
        customer_name: identity.customer_name,
        customer_phone: identity.customer_phone,
        customer_email: identity.customer_email,
        conversation_id: createdConversation.id,
      });

      const conversationMessages = await getConversationMessages(createdConversation.id);
      setConversation(createdConversation);
      setMessages(conversationMessages);
      setIdentity((current) => ({ ...current, first_message: '' }));
    } catch (error) {
      showToast({ title: 'Could not start chat', description: getChatErrorMessage(error), tone: 'error' });
    } finally {
      setSending(false);
    }
  };

  const handleSend = async (message) => {
    if (!conversation?.id) return;
    try {
      setSending(true);
      await updateConversation(conversation.id, {
        customer_name: identity.customer_name || conversation.customer_name,
        customer_phone: identity.customer_phone || conversation.customer_phone,
        customer_email: identity.customer_email || conversation.customer_email,
      });
      await sendChatMessage({
        conversationId: conversation.id,
        senderType: 'customer',
        message,
      });
    } catch (error) {
      showToast({ title: 'Message failed', description: getChatErrorMessage(error), tone: 'error' });
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed bottom-24 right-4 z-[70] w-[min(100vw-2rem,24rem)] overflow-hidden rounded-[1.8rem] border border-stone-300 bg-stone-50 shadow-[0_24px_50px_-24px_rgba(15,23,42,0.35)]">
      <div className="flex items-center justify-between bg-ink-900 px-4 py-3 text-white">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-700">
            <MessageCircleMore className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-bold">Live chat</p>
            <p className="text-xs text-ink-200">{conversation ? `Status: ${conversation.status}` : 'Talk to Simon directly'}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setMinimized((current) => !current)} className="rounded-lg p-2 text-ink-200 hover:bg-white/10">
            <Minus className="h-4 w-4" />
          </button>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-ink-200 hover:bg-white/10">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!minimized ? (
        <div className="flex h-[30rem] flex-col">
          {loading ? (
            <div className="flex flex-1 items-center justify-center text-sm text-ink-500">Loading chat...</div>
          ) : conversation ? (
            <>
              <ChatMessageList messages={messages} />
              <ChatComposer onSend={handleSend} disabled={sending} />
            </>
          ) : (
            <form onSubmit={handleStartConversation} className="flex flex-1 flex-col gap-4 p-4">
              <div>
                <h3 className="text-lg font-bold text-ink-900">Start a conversation</h3>
                <p className="mt-1 text-sm leading-6 text-ink-600">Share your details and the first message so Simon can reply in real time.</p>
              </div>
              <input
                className="input-base"
                placeholder="Full name"
                value={identity.customer_name}
                onChange={(event) => setIdentity((current) => ({ ...current, customer_name: event.target.value }))}
              />
              <input
                className="input-base"
                placeholder="Phone number"
                value={identity.customer_phone}
                onChange={(event) => setIdentity((current) => ({ ...current, customer_phone: event.target.value }))}
              />
              <input
                className="input-base"
                placeholder="Email address"
                value={identity.customer_email}
                onChange={(event) => setIdentity((current) => ({ ...current, customer_email: event.target.value }))}
              />
              <textarea
                className="input-base min-h-32"
                placeholder="How can Simon help?"
                value={identity.first_message}
                onChange={(event) => setIdentity((current) => ({ ...current, first_message: event.target.value }))}
              />
              <Button type="submit" disabled={sending}>
                {sending ? 'Starting...' : 'Start chat'}
              </Button>
            </form>
          )}
          {unreadCount > 0 && conversation ? (
            <div className="border-t border-stone-200 bg-brand-50 px-4 py-2 text-center text-xs font-semibold text-brand-700">
              {unreadCount} new {unreadCount === 1 ? 'reply' : 'replies'}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
