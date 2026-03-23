import ChatMessageList from '@/components/chat/ChatMessageList';
import ChatComposer from '@/components/chat/ChatComposer';
import EmptyState from '@/components/ui/EmptyState';

const statusOptions = ['open', 'pending', 'closed'];

export default function AdminChatThread({
  conversation,
  messages,
  onSend,
  onStatusChange,
  loading,
}) {
  if (!conversation) {
    return (
      <EmptyState
        title="Select a conversation"
        description="Choose a chat from the inbox to read messages and reply."
      />
    );
  }

  return (
    <div className="card-surface flex h-[70vh] flex-col overflow-hidden rounded-3xl">
      <div className="border-b border-stone-200 px-4 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-ink-900">{conversation.customer_name}</h2>
            <p className="mt-1 text-sm text-ink-500">{conversation.customer_phone || conversation.customer_email || 'No contact detail'}</p>
          </div>
          <select
            className="input-base max-w-40 py-2"
            value={conversation.status}
            onChange={(event) => onStatusChange(event.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
      <ChatMessageList messages={messages} ownerView />
      <ChatComposer onSend={onSend} disabled={loading} placeholder="Reply to customer..." />
    </div>
  );
}
