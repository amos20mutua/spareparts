import { useState } from 'react';
import Button from '@/components/ui/Button';

export default function ChatComposer({ onSend, disabled, placeholder = 'Write a message...' }) {
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    await onSend(trimmed);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-stone-200 bg-white p-3">
      <div className="flex gap-2">
        <textarea
          className="input-base min-h-[48px] resize-none py-2.5"
          placeholder={placeholder}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          disabled={disabled}
        />
        <Button type="submit" disabled={disabled}>
          Send
        </Button>
      </div>
    </form>
  );
}
