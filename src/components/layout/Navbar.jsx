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
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-stone-50/92 backdrop-blur-xl">
      <div className="container-shell flex h-14 items-center justify-between gap-4">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          {brandImage ? (
            <img src={brandImage} alt={siteSettings.business_name} className="h-8 w-8 rounded-xl object-cover sm:h-9 sm:w-9" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-700 text-[11px] font-extrabold text-white sm:h-9 sm:w-9">{logoLabel}</div>
          )}
          <div className="min-w-0">
            <p className="truncate text-[13px] font-extrabold tracking-tight text-ink-900 sm:text-sm">{siteSettings.business_name}</p>
            <p className="hidden truncate text-xs text-ink-500 sm:block">{siteSettings.tagline}</p>
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
          <Link to="/parts" aria-label="Search parts" className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100 text-ink-700 transition hover:bg-stone-200">
            <Search className="h-4 w-4" />
          </Link>
          <a href={getPhoneHref(siteSettings.contact_phone)}>
            <span className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-sm font-semibold text-ink-800 transition hover:border-brand-200 hover:text-brand-700">
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
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-stone-300 bg-white lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-stone-200 bg-white lg:hidden">
          <div className="container-shell flex flex-col gap-1 py-3">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) => `${getNavLinkClass({ isActive })} rounded-xl px-3 py-2`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <a href={getPhoneHref(siteSettings.contact_phone)}>
                <Button variant="secondary" className="w-full">
                  Call Simon
                </Button>
              </a>
              <Link to="/request-part" onClick={() => setOpen(false)}>
                <Button className="w-full">Request a Part</Button>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
