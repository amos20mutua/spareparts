import { Link } from 'react-router-dom';
import { navigationLinks } from '@/lib/constants';
import { useSiteContent } from '@/hooks/useSiteContent';
import Button from '@/components/ui/Button';
import { buildWhatsAppLink, getPhoneHref } from '@/lib/utils';

export default function Footer() {
  const { siteSettings, footerSettings } = useSiteContent();

  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="container-shell py-6 sm:py-8">
        <div className="flex flex-col gap-3 rounded-[1.35rem] border border-stone-200 bg-stone-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-extrabold text-ink-900">{siteSettings.business_name}</p>
            <p className="mt-1 text-[13px] leading-5 text-ink-600 sm:text-sm sm:leading-6">{footerSettings.description}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <a href={getPhoneHref(siteSettings.contact_phone)}>
              <Button variant="secondary" size="sm" className="w-full sm:w-auto">
                Call now
              </Button>
            </a>
            <a href={buildWhatsAppLink('Hello Simon, I need help finding a spare part.', siteSettings.whatsapp_number)} target="_blank" rel="noreferrer">
              <Button size="sm" className="w-full sm:w-auto">
                Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr,0.75fr,0.9fr]">
          <div>
            <p className="font-extrabold text-ink-900">{siteSettings.business_name}</p>
            <p className="mt-1 text-[13px] text-ink-500">{siteSettings.tagline}</p>
          </div>

          {footerSettings.show_quick_links ? (
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-[0.18em] text-ink-500">Quick links</h3>
              <div className="mt-3 flex flex-col gap-2 text-sm">
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

          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-[0.18em] text-ink-500">Contact</h3>
            <div className="mt-3 space-y-2 text-sm text-ink-700">
              <p>{footerSettings.address}</p>
              <p>{footerSettings.phone}</p>
              <p>{footerSettings.email}</p>
              <div className="pt-1">
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
