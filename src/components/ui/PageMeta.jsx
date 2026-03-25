import { useEffect } from 'react';
import { useSiteContent } from '@/hooks/useSiteContent';

function updateMeta(selector, attribute, value) {
  const element = document.querySelector(selector);
  if (element && value) {
    element.setAttribute(attribute, value);
  }
}

export default function PageMeta({ title, description }) {
  const { siteSettings } = useSiteContent();

  useEffect(() => {
    const businessName = siteSettings.business_name || 'Simon Spare Parts';
    document.title = title ? `${title} | ${businessName}` : businessName;

    const nextDescription = description || `${businessName} helps customers check stock, fitment, and pricing quickly.`;
    updateMeta('meta[name="description"]', 'content', nextDescription);
    updateMeta('meta[property="og:title"]', 'content', title ? `${title} | ${businessName}` : businessName);
    updateMeta('meta[property="og:description"]', 'content', nextDescription);
    updateMeta('meta[name="twitter:title"]', 'content', title ? `${title} | ${businessName}` : businessName);
    updateMeta('meta[name="twitter:description"]', 'content', nextDescription);
  }, [description, siteSettings.business_name, title]);

  return null;
}
