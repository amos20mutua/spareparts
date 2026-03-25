import { useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileActionBar from '@/components/layout/MobileActionBar';
import ChatLauncher from '@/components/chat/ChatLauncher';
import ChatWidget from '@/components/chat/ChatWidget';

export default function AppLayout() {
  const [chatOpen, setChatOpen] = useState(false);
  const launcherKey = useMemo(() => (chatOpen ? 'open' : 'closed'), [chatOpen]);

  return (
    <div className="min-h-screen bg-ink-50">
      <Navbar />
      <main className="pb-20 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileActionBar />
      <ChatWidget open={chatOpen} onClose={() => setChatOpen(false)} />
      <ChatLauncher key={launcherKey} onClick={() => setChatOpen((current) => !current)} />
    </div>
  );
}
