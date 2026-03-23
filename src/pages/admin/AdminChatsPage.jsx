import { useEffect, useMemo, useState } from 'react';
import AdminChatList from '@/features/admin/chats/AdminChatList';
import AdminChatThread from '@/features/admin/chats/AdminChatThread';
import LoadingState from '@/components/ui/LoadingState';
import { useToast } from '@/hooks/useToast';
import {
  getAdminChatSnapshot,
  markMessagesAsRead,
  sendChatMessage,
  subscribeToAdminChats,
  updateConversation,
} from '@/services/chatService';
import { getErrorMessage } from '@/lib/utils';

function buildConversationViewModel(conversations, messages) {
  return conversations.map((conversation) => {
    const thread = messages.filter((message) => message.conversation_id === conversation.id);
    const latestMessage = thread[thread.length - 1];
    const unreadCount = thread.filter((message) => message.sender_type === 'customer' && !message.is_read).length;
    return {
      ...conversation,
      latestMessage: latestMessage?.message,
      unreadCount,
    };
  });
}

export default function AdminChatsPage() {
  const [snapshot, setSnapshot] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [sending, setSending] = useState(false);
  const { showToast } = useToast();

  const loadChats = async () => {
    const nextSnapshot = await getAdminChatSnapshot();
    setSnapshot(nextSnapshot);
    if (!selectedId && nextSnapshot.conversations[0]) {
      setSelectedId(nextSnapshot.conversations[0].id);
    }
  };

  useEffect(() => {
    loadChats().catch((error) => {
      showToast({ title: 'Could not load chats', description: getErrorMessage(error), tone: 'error' });
    });
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToAdminChats(async (payload) => {
      await loadChats();

      if (
        payload.eventType === 'INSERT' &&
        payload.new?.sender_type === 'customer' &&
        document.hidden &&
        'Notification' in window &&
        Notification.permission === 'granted'
      ) {
        new Notification('New customer message', {
          body: payload.new.message,
        });
      }
    });

    return unsubscribe;
  }, [selectedId]);

  const conversations = useMemo(
    () => (snapshot ? buildConversationViewModel(snapshot.conversations, snapshot.messages) : []),
    [snapshot],
  );

  const selectedConversation = conversations.find((conversation) => conversation.id === selectedId) || null;
  const selectedMessages = snapshot?.messages.filter((message) => message.conversation_id === selectedId) || [];

  useEffect(() => {
    if (!selectedId) return;
    markMessagesAsRead(selectedId, 'owner')
      .then(() => loadChats())
      .catch(() => {});
  }, [selectedId]);

  const handleSend = async (message) => {
    if (!selectedConversation) return;
    try {
      setSending(true);
      await sendChatMessage({
        conversationId: selectedConversation.id,
        senderType: 'owner',
        message,
      });
      await loadChats();
    } catch (error) {
      showToast({ title: 'Reply failed', description: getErrorMessage(error), tone: 'error' });
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (status) => {
    if (!selectedConversation) return;
    try {
      await updateConversation(selectedConversation.id, { status });
      await loadChats();
    } catch (error) {
      showToast({ title: 'Status update failed', description: getErrorMessage(error), tone: 'error' });
    }
  };

  const requestBrowserNotifications = async () => {
    if (!('Notification' in window)) return;
    await Notification.requestPermission();
  };

  if (!snapshot) {
    return <LoadingState label="Loading chats..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Chats</h1>
          <p className="mt-2 text-sm text-ink-600">Live customer conversations powered by Supabase Realtime.</p>
        </div>
        {'Notification' in window ? (
          <button type="button" onClick={requestBrowserNotifications} className="text-sm font-semibold text-brand-700">
            Enable browser notifications
          </button>
        ) : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr,1.25fr]">
        <AdminChatList conversations={conversations} selectedId={selectedId} onSelect={setSelectedId} />
        <AdminChatThread
          conversation={selectedConversation}
          messages={selectedMessages}
          onSend={handleSend}
          onStatusChange={handleStatusChange}
          loading={sending}
        />
      </div>
    </div>
  );
}
