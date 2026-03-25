import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import Button from '@/components/ui/Button';
import PageMeta from '@/components/ui/PageMeta';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/lib/utils';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, isConfigured } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/admin/dashboard';

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await signIn({ email, password });
      navigate(from, { replace: true });
    } catch (error) {
      showToast({
        title: 'Login failed',
        description: getErrorMessage(error, 'Please confirm your Supabase admin credentials.'),
        tone: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-shell py-16">
      <PageMeta title="Admin login" description="Secure admin login for Simon Spare Parts content and catalog management." />
      <div className="mx-auto max-w-md card-surface rounded-[2rem] p-8">
        <div className="inline-flex rounded-2xl bg-brand-50 p-3 text-brand-700">
          <LockKeyhole className="h-5 w-5" />
        </div>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-ink-900">Admin login</h1>
        <p className="mt-3 text-sm leading-7 text-ink-600">
          Use a Supabase Auth user account with admin access to manage parts, requests, and messages.
        </p>
        {!isConfigured ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` before using the admin dashboard.
          </div>
        ) : null}
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="label-base">Email</label>
            <input className="input-base" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label-base">Password</label>
            <input className="input-base" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={loading || !isConfigured}>
            {loading ? 'Signing in...' : 'Log in'}
          </Button>
        </form>
      </div>
    </div>
  );
}
