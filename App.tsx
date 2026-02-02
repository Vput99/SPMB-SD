import React, { useState, useEffect } from 'react';
import { Home } from './views/Home';
import { Registration } from './views/Registration';
import { Announcement } from './views/Announcement';
import { Students } from './views/Students';
import { Admin } from './views/Admin';
import { ChatWidget } from './components/ChatWidget';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');

  // Simple hash router implementation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'home';
      setCurrentPage(hash);
      window.scrollTo(0, 0); // Scroll to top on change
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
        return <Registration onNavigate={navigate} />;
      case 'announcement':
        return <Announcement onNavigate={navigate} />;
      case 'students':
        return <Students onNavigate={navigate} />;
      case 'admin':
        return <Admin onNavigate={navigate} />;
      default:
        return <Home onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      <main className="flex-grow w-full max-w-md mx-auto md:max-w-full bg-white md:bg-gray-50 min-h-screen shadow-2xl md:shadow-none relative">
        {renderPage()}
      </main>
      <ChatWidget />
    </div>
  );
};

export default App;