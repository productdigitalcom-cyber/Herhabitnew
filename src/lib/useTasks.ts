import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { OperationType, handleFirestoreError } from './firestoreErrorHandler';

export interface Task {
  id: string;
  ownerId: string;
  title: string;
  completed: boolean;
  type: string;
  tag?: string;
  reminderTime?: string;
  date?: string;
  createdAt: any;
}

export function useTasks(type?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setTasks([]);
        setLoading(false);
        return;
      }

      const tasksRef = collection(db, 'users', user.uid, 'tasks');
      const q = query(tasksRef);

      const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        const parsedTasks: Task[] = [];
        snapshot.forEach((doc) => {
          parsedTasks.push({ id: doc.id, ...doc.data() } as Task);
        });
        setTasks(parsedTasks);
        setLoading(false);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'tasks');
      });

      return () => unsubscribeSnapshot();
    });

    return () => unsubscribeAuth();
  }, []);

  const addTask = async (title: string, taskType: string, tag?: string, reminderTime?: string, date?: string) => {
    if (!auth.currentUser) return;
    try {
      const taskData: any = {
        ownerId: auth.currentUser.uid,
        title,
        completed: false,
        type: taskType,
        createdAt: serverTimestamp(),
      };
      if (tag) {
        taskData.tag = tag;
      }
      if (reminderTime) {
        taskData.reminderTime = reminderTime;
      }
      if (date) {
        taskData.date = date;
      }
      const tasksRef = collection(db, 'users', auth.currentUser.uid, 'tasks');
      await addDoc(tasksRef, taskData);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'tasks');
    }
  };

  const toggleTask = async (taskId: string, currentStatus: boolean) => {
    if (!auth.currentUser) return;
    try {
      const taskRef = doc(db, 'users', auth.currentUser.uid, 'tasks', taskId);
      await updateDoc(taskRef, { completed: !currentStatus });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tasks/${taskId}`);
    }
  };

  const updateTask = async (taskId: string, data: Partial<Task>) => {
    if (!auth.currentUser) return;
    try {
      const taskRef = doc(db, 'users', auth.currentUser.uid, 'tasks', taskId);
      await updateDoc(taskRef, data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tasks/${taskId}`);
    }
  };

  const deleteTask = async (taskId: string) => {
     if (!auth.currentUser) return;
     try {
       const taskRef = doc(db, 'users', auth.currentUser.uid, 'tasks', taskId);
       await deleteDoc(taskRef);
     } catch (error) {
       handleFirestoreError(error, OperationType.DELETE, `tasks/${taskId}`);
     }
  }

  // Helper to filter tasks by type
  const getTasksByType = (filterType: string) => tasks.filter(t => t.type === filterType);

  return { tasks, loading, addTask, toggleTask, updateTask, deleteTask, getTasksByType };
}
