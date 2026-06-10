import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { db, auth } from './firebase';
import { OperationType, handleFirestoreError } from './firestoreErrorHandler';

export interface DailyLog {
  water: number;
  mood?: string;
  focus?: string;
  dateLabel: string;
}

export function useDailyLog() {
  const [log, setLog] = useState<DailyLog | null>(null);
  const [loading, setLoading] = useState(true);

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setLog(null);
        setLoading(false);
        return;
      }

      console.log("Setting up daily log listener for", user.uid);
      const logRef = doc(db, 'users', user.uid, 'daily_logs', todayStr);

      const unsubscribeSnapshot = onSnapshot(logRef, (snapshot) => {
        if (snapshot.exists()) {
          setLog(snapshot.data() as DailyLog);
        } else {
          setLog(null); // No log for today yet
        }
        setLoading(false);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, `daily_logs/${todayStr}`);
      });

      return () => unsubscribeSnapshot();
    });

    return () => unsubscribeAuth();
  }, [todayStr]);

  const updateLog = async (updates: Partial<DailyLog>) => {
    if (!auth.currentUser) return;
    try {
      const logRef = doc(db, 'users', auth.currentUser.uid, 'daily_logs', todayStr);
      
      if (log) {
        const validUpdates = Object.fromEntries(
          Object.entries(updates).filter(([_, v]) => v !== undefined)
        );
        await updateDoc(logRef, {
          ...validUpdates,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Create new log using setDoc
        const newData: any = {
          ownerId: auth.currentUser.uid,
          dateLabel: todayStr,
          water: updates.water !== undefined ? updates.water : 0,
          updatedAt: serverTimestamp(),
        };
        if (updates.mood !== undefined) newData.mood = updates.mood;
        if (updates.focus !== undefined) newData.focus = updates.focus;

        await setDoc(logRef, newData);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `daily_logs/${todayStr}`);
    }
  };

  return { log, loading, updateLog };
}
