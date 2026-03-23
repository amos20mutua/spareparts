import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PartForm from '@/components/parts/PartForm';
import LoadingState from '@/components/ui/LoadingState';
import { getCategories } from '@/services/categoriesService';
import { createPart, getPartById, updatePart } from '@/services/partsService';
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
        }),
      )
      .finally(() => setLoading(false));
  }, [id, mode]);

  const handleSubmit = async (values) => {
    try {
      setSaving(true);
      const payload = {
        ...values,
        price: values.price === '' ? null : Number(values.price),
      };

      if (mode === 'edit') {
        await updatePart(id, payload);
      } else {
        await createPart(payload);
      }

      showToast({
        title: mode === 'edit' ? 'Product updated' : 'Product created',
        description: 'The catalog has been updated successfully.',
      });
      navigate('/admin/products');
    } catch (error) {
      showToast({
        title: 'Could not save part',
        description: getErrorMessage(error),
        tone: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file) => {
    try {
      setUploadingImage(true);
      const url = await uploadPartImage(file);
      showToast({
        title: 'Image uploaded',
        description: 'The uploaded image URL has been added to the form.',
      });
      return url;
    } catch (error) {
      showToast({
        title: 'Image upload failed',
        description: getErrorMessage(error),
        tone: 'error',
      });
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return <LoadingState label="Loading part editor..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">{mode === 'edit' ? 'Edit product' : 'Add new product'}</h1>
        <p className="mt-2 text-sm text-ink-600">Keep every product clear, searchable, and easy to inquire about.</p>
      </div>
      <PartForm
        initialValues={initialValues}
        categories={categories}
        onSubmit={handleSubmit}
        loading={saving}
        onImageUpload={handleImageUpload}
        uploadingImage={uploadingImage}
      />
    </div>
  );
}
