import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Home as HomeIcon, Bookmark, Wallet, TrendingUp, User } from 'lucide-react';
import Home from './pages/Home';
import Finance from './pages/Finance';
import Bookmarks from './pages/Bookmarks';
import Profile from './pages/Profile';
import { AuthProvider } from './context/AuthContext';

function Navigation() {
  const location = useLocation();
  const tabs = [
    { name: 'Home', path: '/app/home', icon: HomeIcon },
    { name: 'Bookmarks', path: '/app/bookmarks', icon: Bookmark },
    { name: 'Finance', path: '/app/finance', icon: Wallet },
    { name: 'Invest', path: '/app/invest', icon: TrendingUp },
    { name: 'Profile', path: '/app/profile', icon: User },
  ];

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] h-16 
                    md:left-6 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:w-20 md:h-auto md:py-8
                    rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-xl shadow-black/50 
                    px-2 md:px-0 flex md:flex-col items-center justify-between md:justify-center md:gap-8 z-50">
      {tabs.map((tab) => {
        const isActive = location.pathname.startsWith(tab.path);
        const Icon = tab.icon;
        return (
          <Link
            key={tab.name}
            to={tab.path}
            className={`flex flex-col items-center justify-center w-full h-full md:w-auto md:h-auto relative text-xs font-semibold transition-colors group ${
              isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon size={20} className="mb-1 md:mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-[0.65rem] md:text-xs leading-none hidden md:block opacity-0 group-hover:opacity-100 absolute left-[120%] bg-slate-900 px-3 py-1.5 rounded-lg border border-white/10 pointer-events-none whitespace-nowrap transition-opacity">{tab.name}</span>
            <span className="text-[0.65rem] leading-none md:hidden">{tab.name}</span>
            {isActive && (
              <div className="absolute bottom-1 md:-right-2 md:bottom-auto md:top-1/2 md:-translate-y-1/2 w-1 h-1 md:w-1.5 md:h-1.5 bg-indigo-400 rounded-full shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
            )}
          </Link>
        );
      })}
    </div>
  );
}

function AppContent() {
  return (
    <div className="w-full h-screen bg-slate-950 text-slate-100 overflow-hidden relative font-sans flex">
      {/* Mesh Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-700/20 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <Navigation />
      
      <div className="flex-1 w-full h-full relative overflow-hidden md:pl-32">
        <Routes>
          <Route path="/app/home" element={<Home />} />
          <Route path="/app/finance" element={<Finance />} />
          <Route path="/app/bookmarks" element={<Bookmarks />} />
          <Route path="/app/invest" element={
            <div className="flex items-center justify-center h-full text-slate-500 relative z-10">Invest Page (Coming Soon)</div>
          } />
          <Route path="/app/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/app/home" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
