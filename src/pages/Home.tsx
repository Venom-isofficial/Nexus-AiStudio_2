import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Bookmark, Share2 } from 'lucide-react';
import { useNews, NewsArticle } from '../hooks/useNews';
import { useBookmarks } from '../hooks/useBookmarks';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['All', 'Macro', 'Rating', 'M&A', 'Regulatory', 'Management', 'Product', 'Other'];

const GlassCard: React.FC<{ children: React.ReactNode; className?: string; onDoubleClick?: (e: React.MouseEvent) => void }> = ({ children, className = '', onDoubleClick }) => (
  <div 
    className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 text-slate-100 flex flex-col gap-3 ${className}`}
    onDoubleClick={onDoubleClick}
  >
    {children}
  </div>
);

const CategoryBadge: React.FC<{ category: string }> = ({ category }) => (
  <span className="text-[0.65rem] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10">
    {category}
  </span>
);

const SentimentBadge: React.FC<{ sentimentLabel: string }> = ({ sentimentLabel }) => {
  const isBullish = sentimentLabel.toLowerCase() === 'bullish';
  const isBearish = sentimentLabel.toLowerCase() === 'bearish';
  return (
    <span className={`text-[0.65rem] font-bold tracking-wider uppercase px-3 py-1 rounded-full border ${
      isBullish ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
      isBearish ? 'bg-red-500/10 text-red-400 border-red-500/20' :
      'bg-slate-500/10 text-slate-400 border-slate-500/20'
    }`}>
      {sentimentLabel}
    </span>
  );
};

const LedTicker: React.FC<{ materiality?: string; corroborationCount?: number }> = ({ materiality, corroborationCount }) => (
  <div className="overflow-hidden whitespace-nowrap box-border bg-white/5 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/10 mt-2">
    <div className="inline-block pl-[100%] animate-[marquee_15s_linear_infinite] font-mono text-[0.85rem] text-indigo-400 font-semibold tracking-wide" style={{ textShadow: '0 0 5px rgba(129,140,248,0.6)' }}>
      {materiality && `IMPACT: ${materiality.toUpperCase()} | `} {corroborationCount !== undefined && `CORROBORATED BY ${corroborationCount} SOURCES`}
    </div>
  </div>
);

const ReadThroughRow: React.FC<{ nodes?: { ticker: string; correlation: number; relationship: string }[] }> = ({ nodes }) => {
  if (!nodes || !Array.isArray(nodes) || nodes.length === 0) return null;
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
      <div className="text-[0.65rem] text-slate-500 uppercase tracking-widest self-center shrink-0 mr-2 font-bold">Read-Through</div>
      {nodes.map((node, i) => (
        <div key={i} className="flex flex-col items-center justify-center shrink-0 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden">
          <div className="font-bold text-[0.85rem] z-10">{node.ticker}</div>
          <div className={`text-[0.6rem] font-bold z-10 ${node.correlation > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {node.correlation > 0 ? '+' : ''}{(node.correlation * 100).toFixed(0)}%
          </div>
        </div>
      ))}
    </div>
  );
};

const NewsCard: React.FC<{ article: NewsArticle; isBookmarked: boolean; onToggleBookmark: (a: NewsArticle) => void }> = ({ article, isBookmarked, onToggleBookmark }) => {
  return (
    <div className="h-full flex flex-col justify-center items-center px-4 pb-[100px] md:pb-0 pt-[140px] md:pt-[100px]" onDoubleClick={() => onToggleBookmark(article)}>
      <GlassCard className="w-full max-w-[600px] max-h-full overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-start mb-2">
          <div className="flex gap-2 flex-wrap">
            <CategoryBadge category={article.category} />
            <SentimentBadge sentimentLabel={article.sentimentLabel} />
          </div>
          <div className="flex gap-4 ml-4">
            <Share2 size={24} className="cursor-pointer text-slate-400 hover:text-white transition-colors" />
            <Bookmark size={24} className={`cursor-pointer transition-colors ${isBookmarked ? 'text-indigo-400 fill-indigo-400' : 'text-slate-400 hover:text-white'}`} onClick={() => onToggleBookmark(article)} />
          </div>
        </div>
        <h2 className="text-xl md:text-2xl font-bold my-2 leading-snug tracking-tight text-white">{article.headline}</h2>
        {article.sources?.length > 0 && (
          <p className="m-0 text-sm text-slate-400">via {article.sources.join(', ')}</p>
        )}
        <div className="my-3 space-y-2">
          {Array.isArray(article.keyTakeaways) && article.keyTakeaways.map((takeaway, idx) => (
            <div key={idx} className="flex gap-3 text-[0.95rem] md:text-base leading-snug text-slate-300">
              <span className="text-indigo-400">•</span>
              <span>{takeaway}</span>
            </div>
          ))}
        </div>
        <ReadThroughRow nodes={article.readThrough} />
        {(article.materiality || (article.corroborationCount !== undefined && article.corroborationCount > 0)) && (
          <LedTicker materiality={article.materiality} corroborationCount={article.corroborationCount} />
        )}
      </GlassCard>
    </div>
  );
};

export default function Home() {
  const [filter, setFilter] = useState('All');
  const { news, loading, loadMore } = useNews(filter);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleToggleBookmark = (article: NewsArticle) => {
    if (!user) {
      navigate('/app/profile');
      return;
    }
    toggleBookmark(article);
  };

  return (
    <div className="w-full h-full relative z-10">
      <div className="absolute top-0 left-0 right-0 px-4 md:px-8 pt-10 md:pt-8 pb-4 bg-gradient-to-b from-slate-950 via-slate-950/90 to-transparent z-10 pointer-events-none">
        <div className="pointer-events-auto max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="uppercase tracking-[2px] text-[0.7rem] text-slate-500 font-bold mb-1">Financial Journalism</div>
            <h1 className="m-0 text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Nexus Editorial</h1>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0 w-full md:w-auto">
            {CATEGORIES.map(cat => {
              const active = filter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-1.5 md:py-2 rounded-full whitespace-nowrap min-h-[28px] border transition-colors ${
                    active ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span className="font-semibold text-[0.7rem] md:text-xs uppercase tracking-wide">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {loading && news.length === 0 ? (
        <div className="h-full flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
        </div>
      ) : news.length === 0 ? (
        <div className="h-full flex justify-center items-center text-slate-400">
          <p>No news found for this category.</p>
        </div>
      ) : (
        <Swiper
          direction="vertical"
          className="w-full h-full"
          resistanceRatio={0}
          onSlideChange={(swiper) => {
            if (swiper.isEnd || swiper.activeIndex >= news.length - 3) {
              loadMore();
            }
          }}
        >
          {news.map(article => (
            <SwiperSlide key={article.id}>
              <NewsCard
                article={article}
                isBookmarked={isBookmarked(article.id)}
                onToggleBookmark={handleToggleBookmark}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
