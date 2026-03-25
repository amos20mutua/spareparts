import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Phone, Search, X } from 'lucide-react';
import { navigationLinks } from '@/lib/constants';
import { getPhoneHref } from '@/lib/utils';
import { getNavLinkClass } from '@/utils/navigation';
import { useSiteContent } from '@/hooks/useSiteContent';
import Button from '../ui/Button';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { siteSettings } = useSiteContent();
  const brandImage = siteSettings.logo_url || siteSettings.favicon_url;
  const logoLabel = siteSettings.business_name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-ink-200/80 bg-ink-50/92 backdrop-blur-xl">
      <div className="container-shell flex h-12 items-center justify-between gap-3 sm:h-14">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          {brandImage ? (
            <img src={brandImage} alt={siteSettings.business_name} className="h-6.5 w-6.5 rounded-lg object-cover sm:h-8 sm:w-8" />
          ) : (
            <div className="flex h-6.5 w-6.5 items-center justify-center rounded-lg bg-brand-700 text-[10px] font-extrabold text-white sm:h-8 sm:w-8">{logoLabel}</div>
          )}
          <div className="min-w-0">
            <p className="truncate text-[11px] font-extrabold tracking-tight text-ink-900 sm:text-sm">{siteSettings.business_name}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navigationLinks.map((link) => (
            <NavLink key={link.href} to={link.href} className={getNavLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/parts" aria-label="Search parts" className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-ink-100 text-ink-700 transition hover:bg-ink-200">
            <Search className="h-4 w-4" />
          </Link>
          <a href={getPhoneHref(siteSettings.contact_phone)}>
            <span className="inline-flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-3 py-1.5 text-sm font-semibold text-ink-800 transition hover:border-brand-200 hover:text-brand-700">
              <Phone className="h-4 w-4" />
              Call Simon
            </span>
          </a>
          <Link to="/request-part">
            <Button size="sm">Request a Part</Button>
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-7.5 w-7.5 items-center justify-center rounded-lg border border-ink-200 bg-white lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-ink-200 bg-white lg:hidden">
          <div className="container-shell flex flex-col gap-0.5 py-2">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) => `${getNavLinkClass({ isActive })} rounded-xl px-2.5 py-1.5 text-[13px]`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-1.5 grid grid-cols-3 gap-1.5 border-t border-ink-200 pt-2">
              <Link to="/parts" onClick={() => setOpen(false)}>
                <Button variant="ghost" size="xs" className="w-full">
                  Search
                </Button>
              </Link>
              <a href={getPhoneHref(siteSettings.contact_phone)}>
                <Button variant="secondary" size="xs" className="w-full">
                  Call
                </Button>
              </a>
              <Link to="/request-part" onClick={() => setOpen(false)}>
                <Button size="xs" className="w-full">Request</Button>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
