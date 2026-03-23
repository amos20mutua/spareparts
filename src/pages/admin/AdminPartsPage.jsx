import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import { deletePart, getParts } from '@/services/partsService';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/lib/utils';

export default function AdminPartsPage() {
  const [parts, setParts] = useState(null);
  const { showToast } = useToast();

  const loadParts = async () => {
    const data = await getParts();
    setParts(data);
  };

  useEffect(() => {
    loadParts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deletePart(id);
      await loadParts();
      showToast({ title: 'Part deleted', description: 'The part has been removed from the catalog.' });
    } catch (error) {
      showToast({ title: 'Delete failed', description: getErrorMessage(error), tone: 'error' });
    }
  };

  if (!parts) {
    return <LoadingState label="Loading parts..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Products</h1>
          <p className="mt-2 text-sm text-ink-600">Manage what customers see in the parts catalog.</p>
        </div>
        <Link to="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add product
          </Button>
        </Link>
      </div>

      {parts.length ? (
        <div className="card-surface overflow-hidden rounded-3xl">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-ink-50">
                <tr className="text-ink-500">
                  <th className="px-4 py-4 font-semibold">Part</th>
                  <th className="px-4 py-4 font-semibold">Vehicle</th>
                  <th className="px-4 py-4 font-semibold">Stock</th>
                  <th className="px-4 py-4 font-semibold">Price</th>
                  <th className="px-4 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {parts.map((part) => (
                  <tr key={part.id} className="border-t border-ink-100">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-ink-900">{part.name}</p>
                      <p className="mt-1 text-ink-500">{part.category?.name || '-'}</p>
                    </td>
                    <td className="px-4 py-4 text-ink-700">
                      {part.vehicle_make} {part.vehicle_model}
                    </td>
                    <td className="px-4 py-4">
                      <Badge>{part.stock_status}</Badge>
                    </td>
                    <td className="px-4 py-4 text-ink-700">{part.price_visible ? `KES ${part.price}` : 'Hidden'}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <Link to={`/admin/products/edit/${part.id}`}>
                          <Button variant="secondary" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="secondary" size="sm" onClick={() => handleDelete(part.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState title="No products yet" description="Add the first product to start building the live catalog." />
      )}
    </div>
  );
}
