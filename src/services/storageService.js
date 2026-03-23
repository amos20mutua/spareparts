import { requireSupabase } from '@/lib/supabase';

const PRODUCT_BUCKET = 'part-images';
const SITE_BUCKET = 'site-media';

async function uploadFile(file, bucketName, folder) {
  const supabase = requireSupabase();
  const extension = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const filePath = `${folder}/${fileName}`;
  const { error } = await supabase.storage.from(bucketName).upload(filePath, file, { upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  return data.publicUrl;
}

export async function uploadPartImage(file) {
  return uploadFile(file, PRODUCT_BUCKET, 'parts');
}

export async function uploadCategoryImage(file) {
  return uploadFile(file, SITE_BUCKET, 'categories');
}

export async function uploadSiteAsset(file, folder = 'general') {
  return uploadFile(file, SITE_BUCKET, folder);
}

export async function listMediaAssets() {
  const supabase = requireSupabase();
  const buckets = [
    { name: SITE_BUCKET, folder: '', label: 'Site Media' },
    { name: PRODUCT_BUCKET, folder: 'parts', label: 'Product Images' },
  ];

  const groups = await Promise.all(
    buckets.map(async (bucket) => {
      try {
        const { data, error } = await supabase.storage.from(bucket.name).list(bucket.folder, {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' },
        });
        if (error) throw error;

        return data
          .filter((item) => !item.id?.endsWith('/'))
          .map((item) => {
            const path = bucket.folder ? `${bucket.folder}/${item.name}` : item.name;
            const { data: urlData } = supabase.storage.from(bucket.name).getPublicUrl(path);
            return {
              id: `${bucket.name}-${path}`,
              bucket: bucket.name,
              label: bucket.label,
              name: item.name,
              path,
              url: urlData.publicUrl,
              created_at: item.created_at,
            };
          });
      } catch {
        return [];
      }
    }),
  );

  return groups.flat().sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
}
