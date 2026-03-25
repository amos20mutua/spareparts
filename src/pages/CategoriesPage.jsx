import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from '@/components/parts/CategoryCard';
import SectionHeading from '@/components/ui/SectionHeading';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import PageMeta from '@/components/ui/PageMeta';
import Button from '@/components/ui/Button';
import { getCategories } from '@/services/categoriesService';

export default function CategoriesPage() {
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <div className="container-shell py-12 sm:py-16">
      <PageMeta
        title="Part categories"
        description="Browse spare part categories to move quickly from a general need to the right listing."
      />

      <SectionHeading
        eyebrow="Categories"
        title="Parts grouped the way customers actually shop"
        description="Use categories to move quickly from a general need to a specific product inquiry."
      />

      {categories === null ? (
        <div className="mt-10">
          <LoadingState label="Loading categories..." />
        </div>
      ) : categories.length ? (
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      ) : (
        <div className="mt-10">
          <EmptyState
            title="No categories yet"
            description="Categories will appear here once they are added from the admin dashboard."
            action={
              <Link to="/parts">
                <Button>Browse parts</Button>
              </Link>
            }
          />
        </div>
      )}
    </div>
  );
}
