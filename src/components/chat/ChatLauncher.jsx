import { MessageCircle } from 'lucide-react';

export default function ChatLauncher({ onClick, unreadCount = 0, href, label = 'Open live chat' }) {
  const sharedClassName =
    'fixed bottom-20 right-4 z-[65] inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-700 text-white shadow-[0_16px_40px_-18px_rgba(16,77,164,0.8)] transition hover:bg-brand-800 md:bottom-5 md:right-5 md:h-14 md:w-14';

  const content = (
    <>
      <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
      {unreadCount > 0 ? (
        <span className="absolute -right-1 -top-1 inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={sharedClassName} aria-label={label}>
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={sharedClassName}
      aria-label={label}
    >
      {content}
    </button>
  );
}
