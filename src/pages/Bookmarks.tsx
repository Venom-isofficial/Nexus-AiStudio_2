import React from 'react';
import { useBookmarks } from '../hooks/useBookmarks';
import { Bookmark as BookmarkIcon, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Bookmarks() {
  const { bookmarks, loading, toggleBookmark } = useBookmarks();
  const bookmarkedList = Object.values(bookmarks);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="w-full h-full relative z-10 overflow-y-auto pb-[120px] md:pb-8 no-scrollbar">
      <div className="pt-[60px] md:pt-10 px-4 md:px-8 pb-5 sticky top-0 bg-slate-950/80 backdrop-blur-xl z-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="uppercase tracking-[2px] text-[0.7rem] text-slate-500 font-bold mb-1">Your Library</div>
          <h1 className="m-0 text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Saved Insights</h1>
        </div>
      </div>

      <div className="px-4 md:px-8 mt-6">
        <div className="max-w-7xl mx-auto">
          {!user ? (
            <div className="text-center text-slate-400 mt-10 flex flex-col items-center p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md max-w-md mx-auto">
              <BookmarkIcon size={48} className="text-slate-600 mb-4" />
              <p className="font-medium text-slate-300">Sign in to save articles.</p>
              <button 
                onClick={() => navigate('/app/profile')}
                className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-white shadow-lg shadow-indigo-500/20"
              >
                <LogIn size={18} />
                Go to Profile
              </button>
            </div>
          ) : loading ? (
            <div className="flex justify-center mt-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
            </div>
          ) : bookmarkedList.length === 0 ? (
            <div className="text-center text-slate-400 mt-10 flex flex-col items-center p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md max-w-md mx-auto">
              <BookmarkIcon size={48} className="text-slate-600 mb-4" />
              <p className="font-medium text-slate-300">You haven't saved any articles yet.</p>
              <p className="text-sm mt-2 text-slate-500">Double tap an article to save it here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {bookmarkedList.map((article: any) => (
                <div key={article.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 md:p-6 flex flex-col relative transition-colors hover:bg-white/10 h-full">
                  <div 
                    className="absolute top-5 right-5 md:top-6 md:right-6 cursor-pointer"
                    onClick={() => toggleBookmark(article as any)}
                  >
                    <BookmarkIcon size={20} className="text-indigo-400 fill-indigo-400 hover:text-indigo-300" />
                  </div>
                  <div className="flex-1 pr-8 mb-4">
                    <div className="flex gap-2 mb-3 flex-wrap">
                      <span className="text-[0.65rem] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10">
                        {article.category}
                      </span>
                      {article.sentimentLabel && (
                        <span className={`text-[0.65rem] font-bold tracking-wider uppercase px-3 py-1 rounded-full border ${
                          article.sentimentLabel?.toLowerCase() === 'bullish' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          article.sentimentLabel?.toLowerCase() === 'bearish' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          'bg-slate-500/10 text-slate-400 border-slate-500/20'
                        }`}>
                          {article.sentimentLabel}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-lg md:text-xl leading-snug mb-2 text-slate-100">{article.headline}</h3>
                  </div>
                  <div className="text-xs text-slate-400 font-medium mt-auto">
                    {article.sources?.join(', ')} • {new Date(article.publishedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
