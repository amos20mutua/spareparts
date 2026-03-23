import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CategoriesPage from './pages/CategoriesPage';
import PartsCatalogPage from './pages/PartsCatalogPage';
import PartDetailsPage from './pages/PartDetailsPage';
import RequestPartPage from './pages/RequestPartPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminPartsPage from './pages/admin/AdminPartsPage';
import AdminPartEditorPage from './pages/admin/AdminPartEditorPage';
import AdminRequestsPage from './pages/admin/AdminRequestsPage';
import AdminMessagesPage from './pages/admin/AdminMessagesPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminChatsPage from './pages/admin/AdminChatsPage';
import AdminSiteSettingsPage from './pages/admin/AdminSiteSettingsPage';
import AdminHomepagePage from './pages/admin/AdminHomepagePage';
import AdminFooterPage from './pages/admin/AdminFooterPage';
import AdminMediaPage from './pages/admin/AdminMediaPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminRoute from './features/admin/components/AdminRoute';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/parts" element={<PartsCatalogPage />} />
        <Route path="/parts/:slug" element={<PartDetailsPage />} />
        <Route path="/request-part" element={<RequestPartPage />} />
      </Route>

      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="site-settings" element={<AdminSiteSettingsPage />} />
        <Route path="homepage" element={<AdminHomepagePage />} />
        <Route path="products" element={<AdminPartsPage />} />
        <Route path="products/new" element={<AdminPartEditorPage mode="create" />} />
        <Route path="products/edit/:id" element={<AdminPartEditorPage mode="edit" />} />
        <Route path="parts" element={<Navigate to="/admin/products" replace />} />
        <Route path="parts/new" element={<Navigate to="/admin/products/new" replace />} />
        <Route path="parts/edit/:id" element={<AdminPartEditorPage mode="edit" />} />
        <Route path="requests" element={<AdminRequestsPage />} />
        <Route path="messages" element={<AdminMessagesPage />} />
        <Route path="chats" element={<AdminChatsPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="footer" element={<AdminFooterPage />} />
        <Route path="media" element={<AdminMediaPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
