import { Link } from 'react-router-dom';
import { navigationLinks } from '@/lib/constants';
import { useSiteContent } from '@/hooks/useSiteContent';

export default function Footer() {
  const { siteSettings, footerSettings } = useSiteContent();

  return (
    <footer className="border-t border-ink-200 bg-white">
      <div className="container-shell py-3 sm:py-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr,0.75fr,0.9fr]">
          <div>
            <p className="text-[13px] font-extrabold text-ink-900">{siteSettings.business_name}</p>
            <p className="mt-1 text-[12px] leading-5 text-ink-600">{footerSettings.description}</p>
            <p className="mt-1 text-[12px] leading-5 text-ink-500">{footerSettings.address}</p>
          </div>

          {footerSettings.show_quick_links ? (
            <div>
              <h3 className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-ink-500">Quick links</h3>
              <div className="mt-2 flex flex-col gap-1 text-[12px]">
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
            <div className="mt-2 space-y-1 text-[12px] text-ink-700">
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
