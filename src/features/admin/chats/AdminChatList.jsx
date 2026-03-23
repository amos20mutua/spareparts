function formatUpdatedTime(value) {
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

export default function AdminChatList({ conversations, selectedId, onSelect }) {
  const statusStyles = {
    open: 'bg-emerald-100 text-emerald-800',
    pending: 'bg-amber-100 text-amber-800',
    closed: 'bg-stone-200 text-stone-700',
  };

  return (
    <div className="card-surface overflow-hidden rounded-3xl">
      <div className="border-b border-stone-200 px-4 py-4">
        <h2 className="text-lg font-extrabold text-ink-900">Conversations</h2>
      </div>
      <div className="max-h-[70vh] overflow-y-auto">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            type="button"
            onClick={() => onSelect(conversation.id)}
            className={`w-full border-b border-stone-200 px-4 py-4 text-left transition ${
              selectedId === conversation.id ? 'bg-brand-50' : 'bg-white hover:bg-stone-50'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-bold text-ink-900">{conversation.customer_name}</p>
                <p className="mt-1 truncate text-sm text-ink-500">{conversation.customer_phone || conversation.customer_email || 'No contact detail'}</p>
              </div>
              <span className="text-[11px] text-ink-400">{formatUpdatedTime(conversation.updated_at)}</span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-ink-600">{conversation.latestMessage || 'No messages yet.'}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${statusStyles[conversation.status] || statusStyles.closed}`}>
                {conversation.status}
              </span>
              {conversation.unreadCount > 0 ? (
                <span className="inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">
                  {conversation.unreadCount}
                </span>
              ) : null}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
