import { useState, useEffect } from 'react';

export interface NewsArticle {
  id: string;
  headline: string;
  keyTakeaways: string[];
  category: string;
  sentiment: string;
  sentimentLabel: string;
  materiality: string;
  corroborationCount: number;
  publishedAt: number;
  sources: string[];
  stock: string;
  readThrough?: { ticker: string; correlation: number; relationship: string }[];
}

const MOCK_NEWS: NewsArticle[] = [
  {
    id: '1',
    headline: 'Federal Reserve Keeps Interest Rates Steady Amid Inflation Concerns',
    keyTakeaways: ['Rates remain unchanged', 'Focus shifts to Q3 data', 'Market reaction muted'],
    category: 'Macro',
    sentiment: 'neutral',
    sentimentLabel: 'Neutral',
    materiality: 'High',
    corroborationCount: 15,
    publishedAt: Date.now() - 3600000,
    sources: ['WSJ', 'Bloomberg'],
    stock: 'SPY',
    readThrough: [{ ticker: 'SPY', correlation: 0.8, relationship: 'Direct' }]
  },
  {
    id: '2',
    headline: 'Tech Giants Announce Strategic Merger in AI Sector',
    keyTakeaways: ['Consolidation in AI software space', 'Regulators to review the deal'],
    category: 'M&A',
    sentiment: 'positive',
    sentimentLabel: 'Bullish',
    materiality: 'Critical',
    corroborationCount: 22,
    publishedAt: Date.now() - 7200000,
    sources: ['FT', 'Reuters'],
    stock: 'QQQ',
    readThrough: [{ ticker: 'MSFT', correlation: 0.9, relationship: 'Competitor' }]
  },
  {
    id: '3',
    headline: 'New Regulatory Framework Proposed for Cryptocurrencies',
    keyTakeaways: ['Stricter KYC requirements', 'Focus on stablecoins'],
    category: 'Regulatory',
    sentiment: 'negative',
    sentimentLabel: 'Bearish',
    materiality: 'High',
    corroborationCount: 8,
    publishedAt: Date.now() - 10800000,
    sources: ['CoinDesk', 'CNBC'],
    stock: 'BTC',
    readThrough: [{ ticker: 'COIN', correlation: -0.7, relationship: 'Negative Impact' }]
  },
  {
    id: '4',
    headline: 'Analysts Upgrade Major Banks Ahead of Earnings',
    keyTakeaways: ['Expected beat on net interest income', 'Reserves remaining steady'],
    category: 'Rating',
    sentiment: 'positive',
    sentimentLabel: 'Bullish',
    materiality: 'Medium',
    corroborationCount: 5,
    publishedAt: Date.now() - 14400000,
    sources: ['Barron\'s'],
    stock: 'JPM',
    readThrough: [{ ticker: 'XLF', correlation: 0.85, relationship: 'Sector Beta' }]
  },
  {
    id: '5',
    headline: 'Global Supply Chain Disruptions Continue to Affect Auto Industry',
    keyTakeaways: ['Semiconductor shortages easing slightly', 'Logistics costs rising'],
    category: 'Macro',
    sentiment: 'negative',
    sentimentLabel: 'Bearish',
    materiality: 'High',
    corroborationCount: 12,
    publishedAt: Date.now() - 18000000,
    sources: ['Reuters', 'Bloomberg'],
    stock: 'TSLA',
    readThrough: [{ ticker: 'F', correlation: 0.7, relationship: 'Sector Impact' }]
  }
];

export const useNews = (categoryFilter: string) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simulate network delay
    const timer = setTimeout(() => {
      let filtered = [...MOCK_NEWS];
      if (categoryFilter.toLowerCase() !== 'all') {
        filtered = filtered.filter(n => n.category.toLowerCase() === categoryFilter.toLowerCase());
      }
      setNews(filtered);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [categoryFilter]);

  const loadMore = async () => {
    // Mock load more by duplicating the existing mock news
    const moreNews = MOCK_NEWS.map(n => ({ ...n, id: n.id + '_' + Date.now() }));
    let filtered = moreNews;
    if (categoryFilter.toLowerCase() !== 'all') {
      filtered = filtered.filter(n => n.category.toLowerCase() === categoryFilter.toLowerCase());
    }
    if (filtered.length > 0) {
      setNews(prev => [...prev, ...filtered]);
    }
  };

  return { news, loading, loadMore };
};
