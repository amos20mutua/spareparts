import { useEffect, useMemo, useState } from 'react';
import { MessageCircleMore, Minus, X } from 'lucide-react';
import Button from '@/components/ui/Button';
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
  const [chatError, setChatError] = useState('');
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

  const refreshConversation = async (conversationId, { markAsRead = false } = {}) => {
    if (!conversationId) return;
    const updatedMessages = await getConversationMessages(conversationId);
    setMessages(updatedMessages);
    if (markAsRead) {
      await markMessagesAsRead(conversationId, 'customer');
    }
  };

  useEffect(() => {
    if (!open || !sessionId) return undefined;
    let cancelled = false;

    const init = async () => {
      try {
        setLoading(true);
        setChatError('');
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
        if (cancelled) return;
        if (!existingConversation) {
          setConversation(null);
          setMessages([]);
          return;
        }
        setConversation(existingConversation);
        await refreshConversation(existingConversation.id, { markAsRead: true });
      } catch (error) {
        if (!cancelled) {
          setConversation(null);
          setMessages([]);
          setChatError(getChatErrorMessage(error));
        }
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
      try {
        await refreshConversation(conversation.id, { markAsRead: open });
      } catch (error) {
        setChatError(getChatErrorMessage(error));
      }
    });
  }, [conversation?.id, open]);

  useEffect(() => {
    if (!open || !conversation?.id) return undefined;
    const intervalId = window.setInterval(() => {
      refreshConversation(conversation.id, { markAsRead: true }).catch((error) => {
        setChatError(getChatErrorMessage(error));
      });
    }, 12000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [conversation?.id, open]);

  useEffect(() => {
    if (open) {
      setMinimized(false);
    }
  }, [open]);

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
      setChatError('');
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

      setConversation(createdConversation);
      await refreshConversation(createdConversation.id, { markAsRead: false });
      setIdentity((current) => ({ ...current, first_message: '' }));
    } catch (error) {
      setChatError(getChatErrorMessage(error));
      showToast({ title: 'Could not start chat', description: getChatErrorMessage(error), tone: 'error' });
    } finally {
      setSending(false);
    }
  };

  const handleSend = async (message) => {
    if (!conversation?.id) return;
    try {
      setSending(true);
      setChatError('');
      const nextProfile = {
        customer_name: identity.customer_name || conversation.customer_name,
        customer_phone: identity.customer_phone || conversation.customer_phone,
        customer_email: identity.customer_email || conversation.customer_email,
      };
      const detailsChanged =
        nextProfile.customer_name !== conversation.customer_name ||
        nextProfile.customer_phone !== conversation.customer_phone ||
        nextProfile.customer_email !== conversation.customer_email;

      if (detailsChanged) {
        await updateConversation(conversation.id, nextProfile);
        setConversation((current) => (current ? { ...current, ...nextProfile } : current));
      }
      const sentMessage = await sendChatMessage({
        conversationId: conversation.id,
        senderType: 'customer',
        message,
      });
      setMessages((current) => [...current, sentMessage]);
    } catch (error) {
      setChatError(getChatErrorMessage(error));
      showToast({ title: 'Message failed', description: getChatErrorMessage(error), tone: 'error' });
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-x-2 bottom-[4.85rem] z-[70] overflow-hidden rounded-[1.25rem] border border-stone-300 bg-stone-50 shadow-[0_24px_50px_-24px_rgba(15,23,42,0.35)] md:inset-x-auto md:bottom-24 md:right-4 md:w-[min(100vw-2rem,24rem)] md:rounded-[1.8rem]">
      <div className="flex items-center justify-between bg-ink-900 px-3.5 py-2.5 text-white md:px-4 md:py-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-700 md:h-9 md:w-9">
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
        <div className="flex max-h-[min(70dvh,32rem)] min-h-[24rem] flex-col md:h-[30rem]">
          {loading ? (
            <div className="flex flex-1 items-center justify-center text-sm text-ink-500">Loading chat...</div>
          ) : conversation ? (
            <>
              {chatError ? (
                <div className="border-b border-rose-200 bg-rose-50 px-4 py-2 text-xs font-medium text-rose-700">{chatError}</div>
              ) : null}
              <ChatMessageList messages={messages} />
              <ChatComposer onSend={handleSend} disabled={sending} />
            </>
          ) : (
            <form onSubmit={handleStartConversation} className="flex flex-1 flex-col gap-3 p-3.5 md:gap-4 md:p-4">
              <div>
                <h3 className="text-base font-bold text-ink-900 md:text-lg">Start a conversation</h3>
                <p className="mt-1 text-[13px] leading-5 text-ink-600 md:text-sm md:leading-6">Share your details and the first message so Simon can reply in real time.</p>
              </div>
              {chatError ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{chatError}</div> : null}
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
                className="input-base min-h-24 md:min-h-32"
                placeholder="How can Simon help?"
                value={identity.first_message}
                onChange={(event) => setIdentity((current) => ({ ...current, first_message: event.target.value }))}
              />
              <Button type="submit" size="sm" disabled={sending}>
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
