import { useEffect, useRef } from 'react';

function formatTimestamp(value) {
  return new Intl.DateTimeFormat('en-KE', {
    hour: 'numeric',
    minute: '2-digit',
    day: 'numeric',
    month: 'short',
  }).format(new Date(value));
}

export default function ChatMessageList({ messages, ownerView = false }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
      {messages.map((message) => {
        const isOwner = message.sender_type === 'owner';
        const alignClass = isOwner ? 'items-end' : 'items-start';
        const bubbleClass = isOwner
          ? 'bg-brand-700 text-white'
          : ownerView
            ? 'bg-stone-100 text-ink-900'
            : 'bg-white text-ink-900 border border-stone-200';

        return (
          <div key={message.id} className={`flex flex-col ${alignClass}`}>
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-6 shadow-sm ${bubbleClass}`}>
              {message.message}
            </div>
            <span className="mt-1 px-1 text-[11px] text-ink-400">{formatTimestamp(message.created_at)}</span>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
