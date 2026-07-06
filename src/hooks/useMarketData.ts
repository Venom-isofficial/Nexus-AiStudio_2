import { useState, useMemo, useEffect } from 'react';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../context/AuthContext';
import { handleFirestoreError, OperationType } from '../lib/firebase-utils';

export interface AssetData {
  id: string;
  ticker: string;
  name: string;
  category: 'Stocks' | 'Crypto' | 'Forex' | 'Commodities' | 'Indices';
  subCategory?: string;
  price: number;
  change: number; // percentage change
  marketCap?: string;
  volume24h?: string;
  history: { time: string; price: number }[]; // For sparklines
  sentimentLabel?: string;
  sentiment30d?: number;
  sentiment7d?: number;
}

const generateHistory = (basePrice: number, volatility: number = 0.02, length: number = 20) => {
  const history = [];
  let currentPrice = basePrice * (1 - volatility); // start a bit lower/higher randomly
  for (let i = 0; i < length; i++) {
    const change = 1 + (Math.random() * volatility * 2 - volatility);
    currentPrice = currentPrice * change;
    history.push({ time: `T-${length - i}`, price: currentPrice });
  }
  // Ensure the last price is the basePrice
  history[length - 1].price = basePrice;
  return history;
};

const INITIAL_MOCK_ASSETS: AssetData[] = [
  { id: '1', ticker: 'AAPL', name: 'Apple Inc.', category: 'Stocks', subCategory: 'Tech', price: 173.50, change: 1.25, marketCap: '2.7T', volume24h: '55M', history: generateHistory(173.50) },
  { id: '2', ticker: 'MSFT', name: 'Microsoft Corp.', category: 'Stocks', subCategory: 'Tech', price: 378.85, change: 0.85, marketCap: '2.8T', volume24h: '22M', history: generateHistory(378.85) },
  { id: '3', ticker: 'NVDA', name: 'NVIDIA Corp.', category: 'Stocks', subCategory: 'Tech', price: 852.10, change: 4.20, marketCap: '2.1T', volume24h: '60M', history: generateHistory(852.10, 0.05) },
  { id: '4', ticker: 'JPM', name: 'JPMorgan Chase & Co.', category: 'Stocks', subCategory: 'Finance', price: 190.20, change: -0.45, marketCap: '540B', volume24h: '10M', history: generateHistory(190.20) },
  { id: '5', ticker: 'JNJ', name: 'Johnson & Johnson', category: 'Stocks', subCategory: 'Healthcare', price: 155.30, change: 0.15, marketCap: '373B', volume24h: '8M', history: generateHistory(155.30, 0.01) },
  { id: '6', ticker: 'BTC', name: 'Bitcoin', category: 'Crypto', subCategory: 'Layer 1', price: 68500.00, change: 2.50, marketCap: '1.3T', volume24h: '45B', history: generateHistory(68500, 0.04) },
  { id: '7', ticker: 'ETH', name: 'Ethereum', category: 'Crypto', subCategory: 'Layer 1', price: 3850.20, change: 3.10, marketCap: '460B', volume24h: '18B', history: generateHistory(3850.20, 0.05) },
  { id: '11', ticker: 'EUR/USD', name: 'Euro / US Dollar', category: 'Forex', price: 1.0850, change: -0.12, history: generateHistory(1.0850, 0.005) },
  { id: '14', ticker: 'GOLD', name: 'Gold (Oz)', category: 'Commodities', price: 2150.40, change: 0.80, history: generateHistory(2150.40, 0.01) },
  { id: '16', ticker: 'SPY', name: 'SPDR S&P 500 ETF', category: 'Indices', price: 510.20, change: 0.40, history: generateHistory(510.20, 0.01) },
];

export const useMarketData = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [subCategory, setSubCategory] = useState('All');
  
  const [assets, setAssets] = useState<AssetData[]>(INITIAL_MOCK_ASSETS);

  useEffect(() => {
    let isMounted = true;
    
    const fetchSentiment = async () => {
      try {
        const sentimentRef = collection(db, 'stock_sentiment');
        const snapshot = await getDocs(query(sentimentRef, limit(100)));
        
        if (isMounted) {
          const sentimentData: Record<string, any> = {};
          snapshot.forEach(doc => {
            const data = doc.data();
            if (data.ticker) {
              sentimentData[data.ticker.toUpperCase()] = data;
            }
          });
          
          setAssets(prevAssets => {
            const newAssets = [...prevAssets];
            
            // Update existing mock assets with sentiment
            newAssets.forEach(asset => {
              const sData = sentimentData[asset.ticker.toUpperCase()];
              if (sData) {
                asset.sentimentLabel = sData.label;
                asset.sentiment30d = sData.sentiment30d;
                asset.sentiment7d = sData.sentiment7d;
                delete sentimentData[asset.ticker.toUpperCase()];
              }
            });
            
            // Add remaining sentiment items as new dummy assets
            Object.values(sentimentData).forEach((sData: any) => {
              newAssets.push({
                id: sData.companyId || sData.ticker,
                ticker: sData.ticker,
                name: sData.ticker, // don't have full name in sentiment
                category: 'Stocks',
                price: 100 + Math.random() * 50, // dummy
                change: (Math.random() * 4) - 2, // dummy
                history: generateHistory(100),
                sentimentLabel: sData.label,
                sentiment30d: sData.sentiment30d,
                sentiment7d: sData.sentiment7d
              });
            });
            
            return newAssets;
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'stock_sentiment');
      }
    };
    
    fetchSentiment();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // 1. Search filter
      const query = searchQuery.toLowerCase();
      const matchesSearch = asset.ticker.toLowerCase().includes(query) || asset.name.toLowerCase().includes(query);
      if (!matchesSearch) return false;

      // 2. Category filter
      if (category !== 'All' && asset.category !== category) return false;

      // 3. Sub-category filter
      if (subCategory !== 'All' && asset.subCategory !== subCategory) return false;

      return true;
    });
  }, [assets, searchQuery, category, subCategory]);

  const getSubCategories = (cat: string) => {
    if (cat === 'All') return [];
    const subs = new Set<string>();
    assets.forEach(a => {
      if (a.category === cat && a.subCategory) {
        subs.add(a.subCategory);
      }
    });
    return Array.from(subs);
  };

  const availableSubCategories = useMemo(() => getSubCategories(category), [category, assets]);

  const getAssetById = (id: string) => assets.find(a => a.ticker.toLowerCase() === id.toLowerCase() || a.id === id);

  return {
    assets: filteredAssets,
    searchQuery,
    setSearchQuery,
    category,
    setCategory: (cat: string) => {
      setCategory(cat);
      setSubCategory('All'); // reset sub-category when main category changes
    },
    subCategory,
    setSubCategory,
    availableSubCategories,
    getAssetById
  };
};
