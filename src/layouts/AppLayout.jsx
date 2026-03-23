import { useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ChatLauncher from '@/components/chat/ChatLauncher';
import ChatWidget from '@/components/chat/ChatWidget';

export default function AppLayout() {
  const [chatOpen, setChatOpen] = useState(false);
  const launcherKey = useMemo(() => (chatOpen ? 'open' : 'closed'), [chatOpen]);

  return (
    <div className="min-h-screen bg-ink-50">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ChatWidget open={chatOpen} onClose={() => setChatOpen(false)} />
      <ChatLauncher key={launcherKey} onClick={() => setChatOpen((current) => !current)} />
    </div>
  );
}
