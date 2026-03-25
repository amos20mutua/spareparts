import { useMemo, useState } from 'react';
import { MessageCircleMore } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import SectionHeading from '@/components/ui/SectionHeading';
import RequestPartForm from '@/components/forms/RequestPartForm';
import { createPartRequest } from '@/services/requestsService';
import { buildWhatsAppLink, getErrorMessage } from '@/lib/utils';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useToast } from '@/hooks/useToast';

function getRequestErrorMessage(error) {
  const message = getErrorMessage(error);
  if (message.toLowerCase().includes('row-level security')) {
    return 'Part requests need the Supabase insert policies from schema.sql. For now, use WhatsApp while the policies are applied.';
  }
  return message;
}

export default function RequestPartPage() {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { siteSettings } = useSiteContent();
  const [searchParams] = useSearchParams();

  const initialValues = useMemo(
    () => ({
      vehicle_make: searchParams.get('make') || '',
      vehicle_model: searchParams.get('model') || '',
      vehicle_year: searchParams.get('year') || '',
      part_needed: searchParams.get('part') || '',
    }),
    [searchParams],
  );

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await createPartRequest(values);
      showToast({
        title: 'Request received',
        description: 'Simon can now review the part request and follow up.',
      });
    } catch (error) {
      showToast({
        title: 'Could not submit request',
        description: getRequestErrorMessage(error),
        tone: 'error',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-shell py-12 sm:py-16">
      <div className="grid gap-8 lg:grid-cols-[0.95fr,1.05fr]">
        <div>
          <SectionHeading
            eyebrow="Request A Part"
            title="Send the vehicle details and the part you need"
            description="Best for price checks, fitment help, or parts not yet listed."
          />
          <div className="mt-8 card-surface rounded-[2rem] bg-ink-900 p-6 text-white">
            <h3 className="text-xl font-extrabold">Prefer WhatsApp?</h3>
            <p className="mt-3 text-sm leading-7 text-ink-200">Send the make, model, year, and part name. Add a photo reference if you have one.</p>
            <a
              href={buildWhatsAppLink('Hello Simon, I need help sourcing a spare part for my vehicle.', siteSettings.whatsapp_number)}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex"
            >
              <span className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white">
                <MessageCircleMore className="h-4 w-4" />
                Chat on WhatsApp
              </span>
            </a>
          </div>
        </div>
        <RequestPartForm onSubmit={handleSubmit} loading={loading} initialValues={initialValues} />
      </div>
    </div>
  );
}
