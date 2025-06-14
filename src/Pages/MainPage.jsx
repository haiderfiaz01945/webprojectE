import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();

  const productCategories = [
    {
      id: 1,
      name: 'Shoes',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      description: 'Step up your style with our versatile footwear collection crafted for comfort and design.'
    },
    {
      id: 2,
      name: 'Watches',
      imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=1180&q=80',
      description: 'Discover premium watches that blend tradition with modern trends.'
    },
    {
      id: 3,
      name: 'Phones',
      imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      description: 'Explore cutting-edge smartphones to keep you connected, stylishly.'
    },
     {
  id: 4,
  name: 'Clothing',
  imageUrl: 'https://i.pinimg.com/736x/ee/70/57/ee70579d760d3dd4a9c75d5bdeffc61a.jpg',
  description: 'Explore modern shirts and clothing that blend comfort with style.'
}
  ];

  const handleItemClick = (itemName) => {
    navigate(`/item/${itemName.toLowerCase()}`);
  };

  const ItemCard = ({ item }) => (
    <div className="flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
      <div
        className="h-52 overflow-hidden cursor-pointer"
        onClick={() => handleItemClick(item.name)}
      >
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
        <p className="text-gray-600 mb-4 flex-grow">{item.description}</p>
        <button
          onClick={() => handleItemClick(item.name)}
          className="mt-auto w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          View More
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white py-20 px-6 text-center relative">
        <div className="max-w-4xl mx-auto z-10 relative">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Discover Your Next Favorite</h1>
          <p className="text-lg sm:text-xl mb-6">Premium selections of footwear, timepieces, and tech – all in one place.</p>
          <button
            onClick={() => handleItemClick('shoes')}
            className="bg-white text-blue-700 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
          >
            Explore Now
          </button>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-cover bg-center"
             style={{ backgroundImage: `url('https://images.unsplash.com/photo-1581235720704-06d3acfcb36c?auto=format&fit=crop&w=1350&q=80')` }}>
        </div>
      </section>

      {/* Intro Section */}
      <section className="max-w-5xl mx-auto text-center px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Handpicked Categories</h2>
        <p className="text-gray-600 text-lg">
          Whether you're looking to upgrade your wardrobe, accessorize with elegance, or get the latest gadgets — our curated selections have something for everyone.
        </p>
      </section>

      {/* Category Grid */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {productCategories.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default MainPage;
