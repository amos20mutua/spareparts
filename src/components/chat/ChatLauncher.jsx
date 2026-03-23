import { MessageCircle } from 'lucide-react';

export default function ChatLauncher({ onClick, unreadCount = 0 }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-5 right-5 z-[65] inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-700 text-white shadow-[0_16px_40px_-18px_rgba(16,77,164,0.8)] transition hover:bg-brand-800"
      aria-label="Open live chat"
    >
      <MessageCircle className="h-6 w-6" />
      {unreadCount > 0 ? (
        <span className="absolute -right-1 -top-1 inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      ) : null}
    </button>
  );
}
