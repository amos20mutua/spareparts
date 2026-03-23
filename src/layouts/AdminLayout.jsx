import { Outlet } from 'react-router-dom';
import AdminSidebar from '@/features/admin/components/AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-ink-50">
      <div className="container-shell flex flex-col gap-6 py-6 lg:flex-row">
        <AdminSidebar />
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
