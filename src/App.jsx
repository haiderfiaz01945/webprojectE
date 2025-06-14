import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './Componenets/NavBar';
import MainPage from './Pages/MainPage';
import Shoes from './Pages/Shoes';
import AdminSite from './Componenets/AdminSite';
import Watches from './Pages/Watches';
import Phones from './Pages/Phones';
import Cart from './Componenets/Cart';
import Login from './Pages/Login';
import Signup from './Componenets/SignUp';
import Checkout from './Pages/Checkout';

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/item/shoes" element={<Shoes />} />
        <Route path="/item/watches" element={<Watches />} />
        <Route path="//item/phones" element={<Phones />} />
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
