import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, LogIn, User } from 'lucide-react';

export default function Profile() {
  const { user, loading, signIn, signOut } = useAuth();

  return (
    <div className="w-full h-full relative z-10 overflow-y-auto pb-[120px] md:pb-8 no-scrollbar">
      <div className="pt-[60px] md:pt-10 px-4 md:px-8 pb-5 sticky top-0 bg-slate-950/80 backdrop-blur-xl z-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="uppercase tracking-[2px] text-[0.7rem] text-slate-500 font-bold mb-1">Account</div>
          <h1 className="m-0 text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Profile</h1>
        </div>
      </div>

      <div className="px-4 md:px-8 mt-6">
        <div className="max-w-7xl mx-auto flex justify-center mt-10">
          {loading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
          ) : user ? (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10 flex flex-col items-center w-full max-w-md">
              <div className="w-24 h-24 bg-indigo-500/20 rounded-full flex items-center justify-center mb-6 border border-indigo-500/50">
                <User size={48} className="text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{user.displayName || 'User'}</h2>
              <p className="text-sm md:text-base text-slate-400 mb-8">{user.email}</p>
              <button 
                onClick={signOut}
                className="w-full py-3.5 bg-white/10 hover:bg-white/20 transition-colors rounded-xl flex items-center justify-center gap-2 text-sm md:text-base font-bold text-white border border-white/10"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10 flex flex-col items-center text-center w-full max-w-md">
              <User size={56} className="text-slate-500 mb-6" />
              <h2 className="text-2xl font-bold text-white mb-3">Sign in to Nexus</h2>
              <p className="text-sm md:text-base text-slate-400 mb-8 leading-relaxed">
                Sign in to save bookmarks and sync your watchlist across devices.
              </p>
              <button 
                onClick={signIn}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-xl flex items-center justify-center gap-3 text-sm md:text-base font-bold text-white shadow-lg shadow-indigo-500/20"
              >
                <LogIn size={20} />
                Sign in with Google
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
