import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "Products";  // use a constant for reusability
const CART_COLLECTION = "Cart";  // use a constant for reusability
const CHECKOUT_COLLECTION = "Checkout"
export const addData = async (product) => {
  await addDoc(collection(db, COLLECTION_NAME), product);
};


export const addDataCheckout = async (product) => {
  await addDoc(collection(db, CHECKOUT_COLLECTION), product);
};
export const addDataCart = async (product) => {
  await addDoc(collection(db, CHECKOUT_COLLECTION), product);
};

export const fetchCheckout = async () => {
  const querySnapshot = await getDocs(collection(db, CHECKOUT_COLLECTION));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};


export const fetchProducts = async () => {
  const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};


/// ✅ NEW FUNCTION: Fetch cart items for logged-in user
export const fetchCartByEmail = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user is currently logged in.");
  }

  const q = query(
    collection(db, CART_COLLECTION),
    where("email",
       "==", user.email)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
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
