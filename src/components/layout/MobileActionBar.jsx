import { Link } from 'react-router-dom';
import { MessageCircleMore, Phone, Search } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';
import { buildWhatsAppLink, getPhoneHref } from '@/lib/utils';

export default function MobileActionBar() {
  const { siteSettings } = useSiteContent();

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-ink-200 bg-white/95 px-2.5 py-1.5 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-2">
        <a
          href={buildWhatsAppLink('Hello Simon, I need help finding a spare part.', siteSettings.whatsapp_number)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 items-center justify-center gap-1 rounded-xl bg-brand-700 px-2 text-[11px] font-semibold text-white"
        >
          <MessageCircleMore className="h-3.5 w-3.5" />
          WhatsApp
        </a>
        <a
          href={getPhoneHref(siteSettings.contact_phone)}
          className="inline-flex h-10 items-center justify-center gap-1 rounded-xl border border-ink-200 bg-white px-2 text-[11px] font-semibold text-ink-900"
        >
          <Phone className="h-3.5 w-3.5" />
          Call
        </a>
        <Link
          to="/request-part"
          className="inline-flex h-10 items-center justify-center gap-1 rounded-xl border border-brand-200 bg-brand-50 px-2 text-[11px] font-semibold text-brand-700"
        >
          <Search className="h-3.5 w-3.5" />
          Request
        </Link>
      </div>
    </div>
  );
}
