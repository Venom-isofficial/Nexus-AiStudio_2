import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, limit, where } from 'firebase/firestore';
import { db } from '../context/AuthContext';
import { handleFirestoreError, OperationType } from '../lib/firebase-utils';

export interface NewsArticle {
  id: string;
  headline: string;
  keyTakeaways: string[];
  category: string;
  sentiment: string;
  sentimentLabel: string;
  materiality?: string;
  corroborationCount?: number;
  publishedAt: number;
  sources: string[];
  stock?: string;
  readThrough?: { ticker: string; correlation: number; relationship: string }[];
}

export const useNews = (categoryFilter: string) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchNews = async () => {
      setLoading(true);
      try {
        const newsRef = collection(db, 'news');
        let q = query(newsRef, limit(50));
        
        if (categoryFilter.toLowerCase() !== 'all') {
          q = query(newsRef, where('category', '==', categoryFilter.toLowerCase()), limit(50));
        }
        
        const snapshot = await getDocs(q);
        const fetchedNews: NewsArticle[] = [];
        snapshot.forEach(doc => {
          fetchedNews.push({ id: doc.id, ...doc.data() } as NewsArticle);
        });
        
        if (isMounted) {
          setNews(fetchedNews);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'news');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchNews();
    
    return () => {
      isMounted = false;
    };
  }, [categoryFilter]);

  const loadMore = async () => {
    // Implement pagination if needed
  };

  return { news, loading, loadMore };
};
