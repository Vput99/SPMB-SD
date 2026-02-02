import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './views/Home';
import { Registration } from './views/Registration';
import { Announcement } from './views/Announcement';
import { Admin } from './views/Admin';
import { Footer } from './components/Footer';
import { ChatWidget } from './components/ChatWidget';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');

  // Simple hash router implementation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'home';
      setCurrentPage(hash);
    };

    // Set initial page
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (page: string) => {
    window.location.hash = page;
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={navigate} />;
      case 'register':
        return <Registration />;
      case 'announcement':
        return <Announcement />;
      case 'admin':
        return <Admin />;
      default:
        return <Home onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      <Navbar currentPage={currentPage} onNavigate={navigate} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <ChatWidget />
      <Footer />
    </div>
  );
};

export default App;