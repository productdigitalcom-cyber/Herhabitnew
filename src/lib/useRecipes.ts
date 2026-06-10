import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { OperationType, handleFirestoreError } from './firestoreErrorHandler';

export interface Recipe {
  id: string; // we'll use this for local UI, though doc.id is the true ID
  ownerId?: string;
  name: string;
  tag: string;
  image: string;
  time: string;
  ingredients: string[];
  instructions: string[];
  createdAt?: any;
}

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setRecipes([]);
        setLoading(false);
        return;
      }

      const recipesRef = collection(db, 'users', user.uid, 'recipes');
      const q = query(recipesRef);

      const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        const parsedRecipes: Recipe[] = [];
        snapshot.forEach((doc) => {
          parsedRecipes.push({ id: doc.id, ...doc.data() } as Recipe);
        });
        setRecipes(parsedRecipes);
        setLoading(false);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'recipes');
      });

      return () => unsubscribeSnapshot();
    });

    return () => unsubscribeAuth();
  }, []);

  const addRecipe = async (recipe: Omit<Recipe, 'id' | 'ownerId' | 'createdAt'>) => {
    if (!auth.currentUser) return;
    try {
      const recipeData: any = {
        ownerId: auth.currentUser.uid,
        ...recipe,
        createdAt: serverTimestamp(),
      };
      const recipesRef = collection(db, 'users', auth.currentUser.uid, 'recipes');
      await addDoc(recipesRef, recipeData);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'recipes');
    }
  };

  const updateRecipe = async (recipeId: string, updates: Partial<Omit<Recipe, 'id' | 'ownerId' | 'createdAt'>>) => {
    if (!auth.currentUser) return;
    try {
      const recipeRef = doc(db, 'users', auth.currentUser.uid, 'recipes', recipeId);
      await updateDoc(recipeRef, updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `recipes/${recipeId}`);
    }
  };

  const deleteRecipe = async (recipeId: string) => {
     if (!auth.currentUser) return;
     try {
       const recipeRef = doc(db, 'users', auth.currentUser.uid, 'recipes', recipeId);
       await deleteDoc(recipeRef);
     } catch (error) {
       handleFirestoreError(error, OperationType.DELETE, `recipes/${recipeId}`);
     }
  }

  return { recipes, loading, addRecipe, updateRecipe, deleteRecipe };
}
