import { Navigate, useLocation } from 'react-router-dom';
import LoadingState from '@/components/ui/LoadingState';
import { useAuth } from '@/hooks/useAuth';

export default function AdminRoute({ children }) {
  const { isAuthenticated, loading, isConfigured } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container-shell py-12">
        <LoadingState label="Checking admin session..." />
      </div>
    );
  }

  if (!isConfigured) {
    return (
      <div className="container-shell py-12">
        <div className="card-surface max-w-2xl rounded-3xl p-8">
          <h1 className="text-2xl font-extrabold text-ink-900">Supabase setup required</h1>
          <p className="mt-4 text-sm leading-7 text-ink-600">
            Admin access depends on Supabase Auth. Add your environment variables before using the protected dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
