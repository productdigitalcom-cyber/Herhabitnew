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
  createdAt: any;
}

export function useTasks(type?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const tasksRef = collection(db, 'users', auth.currentUser.uid, 'tasks');
    // We could add a 'where' clause here for 'type' if we wanted, but we'll filter on client since the rule doesn't enforce the where clause in list queries
    // Actually the rule says: `allow read: if isOwner(userId) && isValidId(userId) && isValidId(taskId)` for single item, wait...
    // The rule doesn't have an `allow list:`! It only has `allow read:` which applies to both `get` and `list`.
    // Wait, let's just query everything and filter, or we can query with where clause.
    // Let's just listen to all tasks to make it easy for dashboard to access everything if needed.
    const q = query(tasksRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const parsedTasks: Task[] = [];
      snapshot.forEach((doc) => {
        parsedTasks.push({ id: doc.id, ...doc.data() } as Task);
      });
      setTasks(parsedTasks);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'tasks');
    });

    return unsubscribe;
  }, []);

  const addTask = async (title: string, taskType: string, tag?: string) => {
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

  return { tasks, loading, addTask, toggleTask, deleteTask, getTasksByType };
}
