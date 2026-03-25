import { useMemo, useState } from 'react';
import { MessageCircleMore } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import SectionHeading from '@/components/ui/SectionHeading';
import RequestPartForm from '@/components/forms/RequestPartForm';
import PageMeta from '@/components/ui/PageMeta';
import { createPartRequest } from '@/services/requestsService';
import { buildWhatsAppLink, getErrorMessage } from '@/lib/utils';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useToast } from '@/hooks/useToast';

function getRequestErrorMessage(error) {
  const message = getErrorMessage(error);
  if (message.toLowerCase().includes('row-level security')) {
    return 'The request form still needs the Supabase insert policies from schema.sql. Use WhatsApp while those policies are being applied.';
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
    <div className="container-shell py-6 sm:py-8 lg:py-10">
      <PageMeta
        title="Request a part"
        description="Send the vehicle details and the part you need so Simon can check stock, pricing, and sourcing."
      />

      <div className="grid gap-5 lg:grid-cols-[0.92fr,1.08fr]">
        <div>
          <SectionHeading
            eyebrow="Request a part"
            title="Send the vehicle and the part needed"
            description="Best for price checks, fitment help, or items not yet listed."
          />
          <div className="mt-5 card-surface rounded-[1.35rem] bg-ink-900 p-4 text-white sm:p-5">
            <h3 className="text-lg font-extrabold">Prefer WhatsApp?</h3>
            <p className="mt-2 text-[13px] leading-6 text-ink-200 sm:text-sm sm:leading-7">Send the make, model, year, and part name. Add a photo if that helps confirm the item faster.</p>
            <a
              href={buildWhatsAppLink('Hello Simon, I need help sourcing a spare part for my vehicle.', siteSettings.whatsapp_number)}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex"
            >
              <span className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white">
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
