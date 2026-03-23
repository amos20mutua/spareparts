import { useEffect, useState } from 'react';
import CategoryCard from '@/components/parts/CategoryCard';
import SectionHeading from '@/components/ui/SectionHeading';
import { getCategories } from '@/services/categoriesService';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <div className="container-shell py-12 sm:py-16">
      <SectionHeading
        eyebrow="Categories"
        title="Parts grouped the way customers actually shop"
        description="Use categories to move quickly from a general need to a specific product inquiry."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
