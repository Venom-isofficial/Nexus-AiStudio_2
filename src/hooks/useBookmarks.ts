import { useState, useEffect, useCallback } from 'react';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import { handleFirestoreError, OperationType } from '../lib/firebase-utils';
import { NewsArticle } from './useNews';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Record<string, Partial<NewsArticle>>>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setBookmarks({});
      setLoading(false);
      return;
    }

    setLoading(true);
    const path = `users/${user.uid}/bookmarks`;
    const unsubscribe = onSnapshot(collection(db, path), (snapshot) => {
      const newBookmarks: Record<string, Partial<NewsArticle>> = {};
      snapshot.forEach(doc => {
        newBookmarks[doc.id] = doc.data() as Partial<NewsArticle>;
      });
      setBookmarks(newBookmarks);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const toggleBookmark = useCallback(async (article: NewsArticle) => {
    if (!user) return;
    
    const path = `users/${user.uid}/bookmarks/${article.id}`;
    
    if (bookmarks[article.id]) {
      try {
        await deleteDoc(doc(db, path));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    } else {
      try {
        const { serverTimestamp } = await import('firebase/firestore');
        await setDoc(doc(db, path), {
          id: article.id,
          headline: article.headline,
          category: article.category,
          sentiment: article.sentiment || '',
          sentimentLabel: article.sentimentLabel || '',
          publishedAt: article.publishedAt || 0,
          sources: article.sources || [],
          createdAt: serverTimestamp()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
      }
    }
  }, [bookmarks, user]);

  const isBookmarked = useCallback((articleId: string) => {
    return !!bookmarks[articleId];
  }, [bookmarks]);

  return { bookmarks, loading, toggleBookmark, isBookmarked };
};
