import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import PageMeta from '@/components/ui/PageMeta';

export default function NotFoundPage() {
  return (
    <div className="container-shell py-16">
      <PageMeta title="Page not found" description="This page is not available. Browse parts or return to the homepage." />
      <div className="card-surface mx-auto max-w-xl rounded-[2rem] p-8 text-center">
        <h1 className="text-3xl font-extrabold text-ink-900">Page not found</h1>
        <p className="mt-4 text-sm leading-7 text-ink-600">
          The page you are looking for is not available. You can return to the homepage or continue browsing parts.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/">
            <Button>Go home</Button>
          </Link>
          <Link to="/parts">
            <Button variant="secondary">Browse parts</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
