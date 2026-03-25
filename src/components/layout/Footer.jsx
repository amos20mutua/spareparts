import { Link } from 'react-router-dom';
import { navigationLinks } from '@/lib/constants';
import { useSiteContent } from '@/hooks/useSiteContent';
import Button from '@/components/ui/Button';
import { buildWhatsAppLink, getPhoneHref } from '@/lib/utils';

export default function Footer() {
  const { siteSettings, footerSettings } = useSiteContent();

  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="container-shell py-4 sm:py-6">
        <div className="flex flex-col gap-2 rounded-[1rem] border border-stone-200 bg-stone-50 px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between sm:rounded-[1.2rem] sm:px-4 sm:py-3.5">
          <div className="max-w-lg">
            <p className="text-[13px] font-extrabold text-ink-900">{siteSettings.business_name}</p>
            <p className="mt-0.5 text-[12px] leading-5 text-ink-600 sm:text-[13px]">{footerSettings.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row">
            <a href={getPhoneHref(siteSettings.contact_phone)}>
              <Button variant="secondary" size="xs" className="w-full sm:w-auto">
                Call
              </Button>
            </a>
            <a href={buildWhatsAppLink('Hello Simon, I need help finding a spare part.', siteSettings.whatsapp_number)} target="_blank" rel="noreferrer">
              <Button size="xs" className="w-full sm:w-auto">
                WhatsApp
              </Button>
            </a>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr,0.75fr,0.9fr]">
          <div>
            <p className="text-sm font-extrabold text-ink-900">{siteSettings.business_name}</p>
            <p className="mt-1 text-[12px] leading-5 text-ink-500">{footerSettings.address}</p>
          </div>

          {footerSettings.show_quick_links ? (
            <div>
              <h3 className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-ink-500">Quick links</h3>
              <div className="mt-2.5 flex flex-col gap-1.5 text-[13px]">
                {navigationLinks.map((link) => (
                  <Link key={link.href} to={link.href} className="text-ink-700 hover:text-brand-700">
                    {link.label}
                  </Link>
                ))}
                <Link to="/request-part" className="text-ink-700 hover:text-brand-700">
                  Request a part
                </Link>
              </div>
            </div>
          ) : (
            <div />
          )}

          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-ink-500">Contact</h3>
            <div className="mt-2.5 space-y-1.5 text-[13px] text-ink-700">
              <p>{footerSettings.phone}</p>
              <p>{footerSettings.email}</p>
              <div className="pt-0.5 text-[12px] leading-5 text-ink-500">
                {footerSettings.business_hours.map((entry) => (
                  <p key={entry}>{entry}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
