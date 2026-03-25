import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Boxes, FileText, Home, Image, LayoutDashboard, ListChecks, LogOut, Mail, MessagesSquare, Settings, Shapes } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';

const links = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Site settings', href: '/admin/site-settings', icon: Settings },
  { label: 'Homepage', href: '/admin/homepage', icon: Home },
  { label: 'Products', href: '/admin/products', icon: Boxes },
  { label: 'Categories', href: '/admin/categories', icon: Shapes },
  { label: 'Requests', href: '/admin/requests', icon: ListChecks },
  { label: 'Chats', href: '/admin/chats', icon: MessagesSquare },
  { label: 'Messages', href: '/admin/messages', icon: Mail },
  { label: 'Footer', href: '/admin/footer', icon: FileText },
  { label: 'Media', href: '/admin/media', icon: Image },
];

export default function AdminSidebar() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <aside className="card-surface h-fit w-full rounded-3xl p-4 lg:sticky lg:top-24 lg:w-72">
      <Link to="/" className="block rounded-2xl bg-brand-600 px-4 py-4 text-white">
        <p className="text-sm font-semibold text-brand-100">Signed in as</p>
        <p className="mt-1 truncate text-lg font-extrabold">{user?.email || 'Admin user'}</p>
      </Link>
      <nav className="mt-5 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive ? 'bg-ink-900 text-white' : 'text-ink-700 hover:bg-ink-100'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
      <Button variant="secondary" className="mt-5 w-full" onClick={handleSignOut}>
        <LogOut className="h-4 w-4" />
        Log out
      </Button>
    </aside>
  );
}
