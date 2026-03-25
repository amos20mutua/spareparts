import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultFooterSettings, defaultHomepageSettings, defaultSiteSettings } from '@/data/siteContent';
import { getSiteContentSnapshot } from '@/services/settingsService';

const SiteContentContext = createContext(null);

function updateIconLink(selector, href) {
  const element = document.querySelector(selector);
  if (element && href) {
    element.setAttribute('href', href);
  }
}

export function SiteContentProvider({ children }) {
  const [siteSettings, setSiteSettings] = useState(defaultSiteSettings);
  const [homepageSettings, setHomepageSettings] = useState(defaultHomepageSettings);
  const [footerSettings, setFooterSettings] = useState(defaultFooterSettings);
  const [loading, setLoading] = useState(true);

  const reloadContent = async () => {
    setLoading(true);
    try {
      const snapshot = await getSiteContentSnapshot();
      setSiteSettings(snapshot.siteSettings);
      setHomepageSettings(snapshot.homepageSettings);
      setFooterSettings(snapshot.footerSettings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadContent();
  }, []);

  useEffect(() => {
    if (siteSettings.favicon_url) {
      updateIconLink('link[rel="icon"]', siteSettings.favicon_url);
      updateIconLink('link[rel="shortcut icon"]', siteSettings.favicon_url);
      updateIconLink('link[rel="apple-touch-icon"]', siteSettings.favicon_url);
    }
  }, [siteSettings.favicon_url]);

  const value = useMemo(
    () => ({
      siteSettings,
      homepageSettings,
      footerSettings,
      loading,
      reloadContent,
      setSiteSettings,
      setHomepageSettings,
      setFooterSettings,
    }),
    [footerSettings, homepageSettings, loading, siteSettings],
  );

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const value = useContext(SiteContentContext);
  if (!value) throw new Error('useSiteContent must be used within SiteContentProvider');
  return value;
}
