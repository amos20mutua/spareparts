import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import PartForm from '@/components/parts/PartForm';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import { getCategories } from '@/services/categoriesService';
import { createPart, deletePart, getPartById, updatePart } from '@/services/partsService';
import { uploadPartImage } from '@/services/storageService';
import { getErrorMessage } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';

const defaults = {
  name: '',
  category_id: '',
  description: '',
  vehicle_make: '',
  vehicle_model: '',
  vehicle_year: '',
  condition: 'New',
  price: '',
  price_visible: true,
  stock_status: 'In Stock',
  featured: false,
  is_active: true,
  image_url: '',
};

export default function AdminPartEditorPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [initialValues, setInitialValues] = useState(defaults);
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (mode !== 'edit' || !id) {
      setLoading(false);
      return;
    }

    getPartById(id)
      .then((part) =>
        setInitialValues({
          ...part,
          price: part.price || '',
          is_active: part.is_active !== false,
        }),
      )
      .finally(() => setLoading(false));
  }, [id, mode]);

  const handleSubmit = async (values, selectedFile) => {
    if (uploadingImage) {
      showToast({
        title: 'Image still uploading',
        description: 'Wait for the current upload to finish before saving the product.',
        tone: 'error',
      });
      return;
    }

    try {
      setSaving(true);
      let imageUrl = values.image_url || '';

      if (selectedFile) {
        setUploadingImage(true);
        imageUrl = await uploadPartImage(selectedFile);
      }

      const payload = {
        ...values,
        image_url: imageUrl,
        price: values.price === '' ? null : Number(values.price),
      };

      if (mode === 'edit') {
        await updatePart(id, payload);
      } else {
        await createPart(payload);
      }

      showToast({
        title: mode === 'edit' ? 'Product updated' : 'Product created',
        description: payload.image_url
          ? 'The product and image were saved successfully.'
          : 'The product was saved without an image.',
      });
      navigate('/admin/products');
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        title: 'Could not save part',
        description: message.includes('invalid input syntax for type uuid')
          ? 'Select a valid category or leave category blank. The empty category value was rejected by Supabase.'
          : message,
        tone: 'error',
      });
    } finally {
      setUploadingImage(false);
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (mode !== 'edit' || !id) return;
    try {
      setSaving(true);
      await deletePart(id);
      showToast({ title: 'Product deleted', description: 'The product has been removed.' });
      navigate('/admin/products');
    } catch (error) {
      showToast({
        title: 'Delete failed',
        description: getErrorMessage(error),
        tone: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState label="Loading part editor..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">{mode === 'edit' ? 'Edit product' : 'Add new product'}</h1>
          <p className="mt-2 text-sm text-ink-600">Keep every product clear, searchable, and easy to inquire about.</p>
        </div>
        {mode === 'edit' ? (
          <Button variant="secondary" onClick={handleDelete} disabled={saving}>
            <Trash2 className="h-4 w-4" />
            Delete product
          </Button>
        ) : null}
      </div>
      <PartForm
        initialValues={initialValues}
        categories={categories}
        onSubmit={handleSubmit}
        loading={saving}
        uploadingImage={uploadingImage}
      />
    </div>
  );
}
