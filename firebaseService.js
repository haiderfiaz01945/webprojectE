import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "Products";  // use a constant for reusability

export const addData = async (product) => {
  await addDoc(collection(db, COLLECTION_NAME), product);
};

export const fetchProducts = async () => {
  const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Optional: add update and delete functions for completeness

export const updateData = async (id, updatedData) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, updatedData);
};

export const deleteData = async (id) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};
