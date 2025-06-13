// cartContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";

const CartContext = createContext();
const CART_COLLECTION = "Cart";

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  // Track logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email);
        await fetchUserCart(user.email);
      } else {
        setUserEmail(null);
        setCartItems([]);
      }
    });
    return unsubscribe;
  }, []);

  // Fetch user's cart items from Firestore
  const fetchUserCart = async (email) => {
    try {
      const q = query(collection(db, CART_COLLECTION), where("email", "==", email));
      const snapshot = await getDocs(q);
      const cart = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id, // Using Firestore doc ID as the main ID for consistency
      }));
      setCartItems(cart);
    } catch (err) {
      console.error("Error fetching user cart:", err);
    }
  };

  const addToCart = async (product) => {
    if (!userEmail) return;
    
    const existing = cartItems.find((item) => item.productId === product.id);
    if (existing) {
      await updateQuantity(existing.id, 1);
    } else {
      const newItem = {
        ...product,
        productId: product.id, // Store original product ID separately
        quantity: 1,
        email: userEmail,
        timestamp: new Date(),
      };
      try {
        const docRef = await addDoc(collection(db, CART_COLLECTION), newItem);
        setCartItems((prev) => [...prev, { ...newItem, id: docRef.id }]);
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  const removeFromCart = async (id) => {
    try {
      await deleteDoc(doc(db, CART_COLLECTION, id));
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const updateQuantity = async (id, amount) => {
    const item = cartItems.find((item) => item.id === id);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + amount);
    
    try {
      await updateDoc(doc(db, CART_COLLECTION, id), { quantity: newQuantity });
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}