


import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();
  
  // Sample product categories data
  const productCategories = [
    {
      id: 1,
      name: 'Shoes',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      description: 'Latest collection of footwear for all occasions'
    },
    {
      id: 2,
      name: 'Watches',
      imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80',
      description: 'Elegant timepieces for every style'
    },
    {
      id: 3,
      name: 'Phones',
      imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      description: 'Cutting-edge mobile technology'
    }
  ];

  const handleItemClick = (itemName) => {
    navigate(`/item/${itemName.toLowerCase()}`);
  };

  // ItemCard component embedded within MainPage
  const ItemCard = ({ item }) => (
    <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div 
        className="h-48 overflow-hidden cursor-pointer" 
        onClick={() => handleItemClick(item.name)}
      >
        <img 
          src={item.imageUrl} 
          alt={item.name} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.name}</h3>
        <p className="text-gray-600 mb-4 flex-grow">{item.description}</p>
        <button
          onClick={() => handleItemClick(item.name)}
          className="mt-auto w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
        >
          View More
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 m-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Product Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {productCategories.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default MainPage;