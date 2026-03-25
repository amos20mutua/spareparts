import { Link } from 'react-router-dom';
import { navigationLinks } from '@/lib/constants';
import { useSiteContent } from '@/hooks/useSiteContent';

export default function Footer() {
  const { siteSettings, footerSettings } = useSiteContent();

  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="container-shell grid gap-7 py-8 lg:grid-cols-[1.2fr,0.75fr,0.9fr]">
        <div>
          <p className="font-extrabold text-ink-900">{siteSettings.business_name}</p>
          <p className="mt-1 text-sm text-ink-500">{siteSettings.tagline}</p>
          <p className="mt-4 max-w-sm text-sm leading-6 text-ink-600">{footerSettings.description}</p>
        </div>

        {footerSettings.show_quick_links ? (
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-[0.18em] text-ink-500">Quick links</h3>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              {navigationLinks.map((link) => (
                <Link key={link.href} to={link.href} className="text-ink-700 hover:text-brand-700">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div />
        )}

        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-[0.18em] text-ink-500">Contact</h3>
          <div className="mt-4 space-y-2.5 text-sm text-ink-700">
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
    </footer>
  );
}
