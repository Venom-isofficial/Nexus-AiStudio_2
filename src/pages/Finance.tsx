import React from 'react';
import { Search, Filter, TrendingUp, TrendingDown, Star } from 'lucide-react';
import { useMarketData, AssetData } from '../hooks/useMarketData';
import { useWatchlist } from '../hooks/useWatchlist';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AssetCard: React.FC<{ asset: AssetData; isWatchlisted: boolean; onToggleWatchlist: (id: string) => void }> = ({ asset, isWatchlisted, onToggleWatchlist }) => {
  const isPositive = asset.change >= 0;
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 md:p-6 mb-4 flex flex-col transition-colors hover:bg-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div 
            onClick={() => onToggleWatchlist(asset.id)}
            className="cursor-pointer"
          >
            <Star size={20} className={isWatchlisted ? 'text-amber-400 fill-amber-400' : 'text-slate-600 hover:text-slate-400 transition-colors'} />
          </div>
          <div>
            <div className="font-bold text-lg md:text-xl text-slate-100 flex items-center gap-2">
              {asset.ticker}
              {asset.sentimentLabel && (
                <span className={`text-[0.65rem] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  asset.sentimentLabel.toLowerCase() === 'bullish' ? 'bg-emerald-500/20 text-emerald-400' : 
                  asset.sentimentLabel.toLowerCase() === 'bearish' ? 'bg-red-500/20 text-red-400' : 
                  'bg-slate-500/20 text-slate-400'
                }`}>
                  {asset.sentimentLabel}
                </span>
              )}
            </div>
            <div className="text-xs md:text-sm text-slate-400">{asset.name}</div>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="font-bold text-base md:text-lg text-slate-100">
            {asset.category === 'Forex' ? '' : '$'}{asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
          </div>
          <div className={`flex items-center gap-1 text-xs md:text-sm font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {isPositive ? '+' : ''}{asset.change.toFixed(2)}%
          </div>
        </div>
      </div>
      
      {asset.sentiment30d !== undefined && (
        <div className="mt-2 pt-4 border-t border-white/10 flex justify-between items-center text-xs">
          <div className="text-slate-400">AI Sentiment (30d)</div>
          <div className={`font-medium ${asset.sentiment30d >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {asset.sentiment30d > 0 ? '+' : ''}{(asset.sentiment30d * 100).toFixed(0)}%
          </div>
        </div>
      )}
    </div>
  );
};

const CATEGORIES = ['All', 'Stocks', 'Crypto', 'Forex', 'Commodities', 'Indices'];

export default function Finance() {
  const { 
    assets, 
    searchQuery, setSearchQuery, 
    category, setCategory, 
    subCategory, setSubCategory, 
    availableSubCategories 
  } = useMarketData();
  
  const { watchlist, toggleWatchlist } = useWatchlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleToggleWatchlist = (id: string) => {
    if (!user) {
      navigate('/app/profile');
      return;
    }
    toggleWatchlist(id);
  };

  return (
    <div className="w-full h-full relative z-10 overflow-y-auto pb-[120px] md:pb-8 no-scrollbar">
      <div className="pt-[60px] md:pt-10 px-4 md:px-8 pb-5 sticky top-0 bg-slate-950/80 backdrop-blur-xl z-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="uppercase tracking-[2px] text-[0.7rem] text-slate-500 font-bold mb-1">Markets Hub</div>
          <h1 className="m-0 mb-6 text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Asset Explorer</h1>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
            <div className="flex items-center bg-white/5 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/10 w-full md:w-80">
              <Search size={18} className="text-slate-400 mr-3 shrink-0" />
              <input 
                type="text" 
                placeholder="Search assets, symbols..." 
                className="bg-transparent border-none outline-none text-slate-100 w-full placeholder:text-slate-500 text-sm font-medium"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-1.5 md:py-2 rounded-full whitespace-nowrap min-h-[28px] border transition-colors ${
                    category === cat ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span className="font-semibold text-[0.7rem] md:text-xs uppercase tracking-wide">{cat}</span>
                </button>
              ))}
            </div>
          </div>

          {availableSubCategories.length > 0 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar mt-3 items-center pb-1 w-full">
              <Filter size={14} className="text-indigo-400 shrink-0 mx-2" />
              <button
                onClick={() => setSubCategory('All')}
                className={`px-3 py-1.5 md:py-2 rounded-xl whitespace-nowrap border transition-colors ${
                  subCategory === 'All' ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' : 'bg-transparent border-white/10 text-slate-400 hover:bg-white/5'
                }`}
              >
                <span className="font-semibold text-[0.65rem] md:text-xs uppercase tracking-wide">All</span>
              </button>
              {availableSubCategories.map(subCat => (
                <button
                  key={subCat}
                  onClick={() => setSubCategory(subCat)}
                  className={`px-3 py-1.5 md:py-2 rounded-xl whitespace-nowrap border transition-colors ${
                    subCategory === subCat ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' : 'bg-transparent border-white/10 text-slate-400 hover:bg-white/5'
                  }`}
                >
                  <span className="font-semibold text-[0.65rem] md:text-xs uppercase tracking-wide">{subCat}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-4 md:px-8 mt-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {assets.length === 0 ? (
            <div className="col-span-full text-center text-slate-500 font-medium mt-10">No assets found matching your criteria.</div>
          ) : (
            assets.map(asset => (
              <AssetCard 
                key={asset.id} 
                asset={asset} 
                isWatchlisted={watchlist.has(asset.id)}
                onToggleWatchlist={handleToggleWatchlist}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
