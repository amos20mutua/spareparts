import { useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileActionBar from '@/components/layout/MobileActionBar';
import ChatLauncher from '@/components/chat/ChatLauncher';
import ChatWidget from '@/components/chat/ChatWidget';
import { useSiteContent } from '@/hooks/useSiteContent';
import { buildWhatsAppLink } from '@/lib/utils';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function AppLayout() {
  const [chatOpen, setChatOpen] = useState(false);
  const { siteSettings } = useSiteContent();
  const launcherKey = useMemo(() => (chatOpen ? 'open' : 'closed'), [chatOpen]);
  const whatsappFallback = useMemo(
    () => buildWhatsAppLink('Hello Simon, I need help finding a spare part.', siteSettings.whatsapp_number),
    [siteSettings.whatsapp_number],
  );

  return (
    <div className="min-h-screen bg-ink-50">
      <Navbar />
      <main className="pb-20 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileActionBar />
      {isSupabaseConfigured ? <ChatWidget open={chatOpen} onClose={() => setChatOpen(false)} /> : null}
      <ChatLauncher
        key={launcherKey}
        onClick={isSupabaseConfigured ? () => setChatOpen((current) => !current) : undefined}
        href={!isSupabaseConfigured ? whatsappFallback : undefined}
        label={isSupabaseConfigured ? 'Open live chat' : 'Chat on WhatsApp'}
      />
    </div>
  );
}
