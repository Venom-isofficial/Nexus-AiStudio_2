import { useState, useEffect, useCallback } from 'react';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import { handleFirestoreError, OperationType } from '../lib/firebase-utils';

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setWatchlist(new Set());
      setLoading(false);
      return;
    }

    setLoading(true);
    const path = `users/${user.uid}/watchlist`;
    const unsubscribe = onSnapshot(collection(db, path), (snapshot) => {
      const newWatchlist = new Set<string>();
      snapshot.forEach(doc => {
        newWatchlist.add(doc.id);
      });
      setWatchlist(newWatchlist);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const toggleWatchlist = useCallback(async (assetId: string) => {
    if (!user) return;
    
    const path = `users/${user.uid}/watchlist/${assetId}`;
    
    if (watchlist.has(assetId)) {
      try {
        await deleteDoc(doc(db, path));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    } else {
      try {
        const { serverTimestamp } = await import('firebase/firestore');
        await setDoc(doc(db, path), {
          id: assetId,
          createdAt: serverTimestamp()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
      }
    }
  }, [watchlist, user]);

  return { watchlist, loading, toggleWatchlist };
};
