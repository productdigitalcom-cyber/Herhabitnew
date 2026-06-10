import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { OperationType, handleFirestoreError } from './firestoreErrorHandler';

export interface Idea {
  id: string;
  ownerId?: string;
  title: string;
  platform: string;
  icon: string;
  color: string;
  done: boolean;
  createdAt?: any;
}

export function useIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setIdeas([]);
        setLoading(false);
        return;
      }

      const ideasRef = collection(db, 'users', user.uid, 'ideas');
      const q = query(ideasRef);

      const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        const parsed: Idea[] = [];
        snapshot.forEach((doc) => {
          parsed.push({ id: doc.id, ...doc.data() } as Idea);
        });
        // Option to sort by createdAt if needed
        parsed.sort((a, b) => {
            if (!a.createdAt || !b.createdAt) return 0;
            return b.createdAt.toMillis() - a.createdAt.toMillis();
        });
        setIdeas(parsed);
        setLoading(false);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'ideas');
      });

      return () => unsubscribeSnapshot();
    });

    return () => unsubscribeAuth();
  }, []);

  const addIdea = async (idea: Omit<Idea, 'id' | 'ownerId' | 'createdAt'>) => {
    if (!auth.currentUser) return;
    try {
      const data: any = {
        ownerId: auth.currentUser.uid,
        ...idea,
        createdAt: serverTimestamp(),
      };
      const ideasRef = collection(db, 'users', auth.currentUser.uid, 'ideas');
      await addDoc(ideasRef, data);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'ideas');
    }
  };

  const updateIdea = async (ideaId: string, updates: Partial<Omit<Idea, 'id' | 'ownerId' | 'createdAt'>>) => {
    if (!auth.currentUser) return;
    try {
      const ideaRef = doc(db, 'users', auth.currentUser.uid, 'ideas', ideaId);
      await updateDoc(ideaRef, updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `ideas/${ideaId}`);
    }
  };

  const deleteIdea = async (ideaId: string) => {
     if (!auth.currentUser) return;
     try {
       const ideaRef = doc(db, 'users', auth.currentUser.uid, 'ideas', ideaId);
       await deleteDoc(ideaRef);
     } catch (error) {
       handleFirestoreError(error, OperationType.DELETE, `ideas/${ideaId}`);
     }
  }

  return { ideas, loading, addIdea, updateIdea, deleteIdea };
}
