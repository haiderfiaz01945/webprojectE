import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './Componenets/NavBar';
import MainPage from './Pages/MainPage';
import AdminSite from './Componenets/AdminSite';
 
import Cart from './Componenets/Cart';
import Login from './Pages/Login';
import Signup from './Componenets/SignUp';
import Checkout from './Pages/Checkout';
import ItemsPage from './Pages/ItemsPage';

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/item/:category" element={<ItemsPage />} />
 
        <Route path="/admin" element={<AdminSite />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/checkout" element={<Checkout />} />

      </Routes>
    </Router>
  );
};

export default App;
