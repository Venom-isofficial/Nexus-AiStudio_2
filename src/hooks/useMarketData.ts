import { useState, useMemo } from 'react';

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

const MOCK_ASSETS: AssetData[] = [
  { id: '1', ticker: 'AAPL', name: 'Apple Inc.', category: 'Stocks', subCategory: 'Tech', price: 173.50, change: 1.25, marketCap: '2.7T', volume24h: '55M', history: generateHistory(173.50) },
  { id: '2', ticker: 'MSFT', name: 'Microsoft Corp.', category: 'Stocks', subCategory: 'Tech', price: 378.85, change: 0.85, marketCap: '2.8T', volume24h: '22M', history: generateHistory(378.85) },
  { id: '3', ticker: 'NVDA', name: 'NVIDIA Corp.', category: 'Stocks', subCategory: 'Tech', price: 852.10, change: 4.20, marketCap: '2.1T', volume24h: '60M', history: generateHistory(852.10, 0.05) },
  { id: '4', ticker: 'JPM', name: 'JPMorgan Chase & Co.', category: 'Stocks', subCategory: 'Finance', price: 190.20, change: -0.45, marketCap: '540B', volume24h: '10M', history: generateHistory(190.20) },
  { id: '5', ticker: 'JNJ', name: 'Johnson & Johnson', category: 'Stocks', subCategory: 'Healthcare', price: 155.30, change: 0.15, marketCap: '373B', volume24h: '8M', history: generateHistory(155.30, 0.01) },
  { id: '6', ticker: 'BTC', name: 'Bitcoin', category: 'Crypto', subCategory: 'Layer 1', price: 68500.00, change: 2.50, marketCap: '1.3T', volume24h: '45B', history: generateHistory(68500, 0.04) },
  { id: '7', ticker: 'ETH', name: 'Ethereum', category: 'Crypto', subCategory: 'Layer 1', price: 3850.20, change: 3.10, marketCap: '460B', volume24h: '18B', history: generateHistory(3850.20, 0.05) },
  { id: '8', ticker: 'SOL', name: 'Solana', category: 'Crypto', subCategory: 'Layer 1', price: 145.60, change: -1.20, marketCap: '65B', volume24h: '3B', history: generateHistory(145.60, 0.06) },
  { id: '9', ticker: 'DOGE', name: 'Dogecoin', category: 'Crypto', subCategory: 'Memes', price: 0.15, change: 12.50, marketCap: '21B', volume24h: '2B', history: generateHistory(0.15, 0.1) },
  { id: '10', ticker: 'UNI', name: 'Uniswap', category: 'Crypto', subCategory: 'DeFi', price: 11.20, change: 5.40, marketCap: '6B', volume24h: '400M', history: generateHistory(11.20, 0.07) },
  { id: '11', ticker: 'EUR/USD', name: 'Euro / US Dollar', category: 'Forex', price: 1.0850, change: -0.12, history: generateHistory(1.0850, 0.005) },
  { id: '12', ticker: 'GBP/USD', name: 'British Pound / US Dollar', category: 'Forex', price: 1.2640, change: 0.05, history: generateHistory(1.2640, 0.005) },
  { id: '13', ticker: 'USD/JPY', name: 'US Dollar / Japanese Yen', category: 'Forex', price: 150.25, change: 0.30, history: generateHistory(150.25, 0.005) },
  { id: '14', ticker: 'GOLD', name: 'Gold (Oz)', category: 'Commodities', price: 2150.40, change: 0.80, history: generateHistory(2150.40, 0.01) },
  { id: '15', ticker: 'OIL', name: 'Crude Oil WTI', category: 'Commodities', price: 78.50, change: -1.50, history: generateHistory(78.50, 0.02) },
  { id: '16', ticker: 'SPY', name: 'SPDR S&P 500 ETF', category: 'Indices', price: 510.20, change: 0.40, history: generateHistory(510.20, 0.01) },
  { id: '17', ticker: 'QQQ', name: 'Invesco QQQ Trust', category: 'Indices', price: 435.80, change: 0.75, history: generateHistory(435.80, 0.015) },
];

export const useMarketData = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [subCategory, setSubCategory] = useState('All');

  const filteredAssets = useMemo(() => {
    return MOCK_ASSETS.filter((asset) => {
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
  }, [searchQuery, category, subCategory]);

  const getSubCategories = (cat: string) => {
    if (cat === 'All') return [];
    const subs = new Set<string>();
    MOCK_ASSETS.forEach(a => {
      if (a.category === cat && a.subCategory) {
        subs.add(a.subCategory);
      }
    });
    return Array.from(subs);
  };

  const availableSubCategories = useMemo(() => getSubCategories(category), [category]);

  const getAssetById = (id: string) => MOCK_ASSETS.find(a => a.ticker.toLowerCase() === id.toLowerCase() || a.id === id);

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
