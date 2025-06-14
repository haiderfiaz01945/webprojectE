import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

import NavBar from './Componenets/NavBar';
import MainPage from './Pages/MainPage';
import AdminSite from './Componenets/AdminSite';
import Cart from './Componenets/Cart';
import Login from './Pages/Login';
import Signup from './Componenets/SignUp';
import Checkout from './Pages/Checkout';
import ItemsPage from './Pages/ItemsPage';
import ProductPage from './Pages/Product';
import Orders from './Componenets/Orders';
import { auth } from '../firebase';

const App = () => {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const adminEmail = 'haiderfiaz09@gmail.com';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = user?.email === adminEmail;

  if (!authChecked) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600 border-b-2"></div>
      </div>
    );
  }

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/item/:category" element={<ItemsPage />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product/:id" element={<ProductPage />} />

        {/* ✅ Protected Routes (Only for admin email) */}
        <Route
          path="/orders"
          element={isAdmin ? <Orders /> : <Navigate to="/" replace />}
        />
        <Route
          path="/admin"
          element={isAdmin ? <AdminSite /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
};

export default App;
