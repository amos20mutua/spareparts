import { useEffect, useState } from 'react';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import { getContactMessages } from '@/services/messagesService';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    getContactMessages().then(setMessages);
  }, []);

  if (!messages) {
    return <LoadingState label="Loading contact messages..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Messages</h1>
        <p className="mt-2 text-sm text-ink-600">Saved customer messages for follow-up.</p>
      </div>
      {messages.length ? (
        <div className="grid gap-5">
          {messages.map((message) => (
            <div key={message.id} className="card-surface rounded-3xl p-5">
              <h3 className="text-lg font-bold text-ink-900">{message.full_name}</h3>
              <p className="mt-1 text-sm text-ink-600">
                {message.phone} • {message.email}
              </p>
              <p className="mt-4 text-sm leading-7 text-ink-700">{message.message}</p>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No messages yet" description="Incoming contact form messages will appear here." />
      )}
    </div>
  );
}
