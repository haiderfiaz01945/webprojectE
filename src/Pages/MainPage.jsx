import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();

  const productCategories = [
    {
      id: 1,
      name: 'Shoes',
      imageUrl: 'https://i.pinimg.com/736x/ce/af/21/ceaf21c671cc9b4ed6c9c68adcac1d2b.jpg',
      description: 'Step up your style with our versatile footwear collection crafted for comfort and design.'
    },
    {
      id: 2,
      name: 'Watches',
      imageUrl: 'https://i.pinimg.com/736x/f0/3a/ae/f03aae15ec9bdd0060b563a3b8734dfa.jpg',
      description: 'Discover premium watches that blend tradition with modern trends.'
    },
    {
      id: 3,
      name: 'Phones',
      imageUrl: 'https://i.pinimg.com/736x/3b/3e/1c/3b3e1cc19e6c2fde5c3d27161307b10f.jpg',
      description: 'Explore cutting-edge smartphones to keep you connected, stylishly.'
    },
    {
      id: 4,
      name: 'Clothing',
      imageUrl: 'https://i.pinimg.com/736x/85/f5/ab/85f5ab828c6283e80bf92d97651a15ab.jpg',
      description: 'Explore modern shirts and clothing that blend comfort with style.'
    }
  ];

  const handleItemClick = (itemName) => {
    navigate(`/item/${itemName.toLowerCase()}`);
  };

  const ItemCard = ({ item }) => (
    <div className="flex flex-col bg-[#393E46] rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
      <div
        className="h-52 overflow-hidden cursor-pointer"
        onClick={() => handleItemClick(item.name)}
      >
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-[#EEEEEE] mb-2">{item.name}</h3>
        <p className="text-[#b5b5b5] mb-4 flex-grow">{item.description}</p>
        <button
          onClick={() => handleItemClick(item.name)}
          className="mt-auto w-full py-2 px-4 bg-[#00ADB5] text-[#EEEEEE] text-sm font-medium rounded-md hover:bg-[#008E9B] transition-colors"
        >
          View More
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center bg-[#222831]">
      {/* Hero Section */}
      <section className="w-full h-[500px] relative flex items-center justify-center text-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-[#222831]/80 z-0"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80')`,
            backgroundPosition: 'center 30%'
          }}
        ></div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl px-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-[#EEEEEE]">
            <span className="block mb-2">Welcome to</span>
            <span className="text-[#00ADB5]">Elite Horizon</span>
          </h1>
          <p className="text-lg sm:text-xl mb-8 text-[#EEEEEE]">
            Premium selections of footwear, timepieces, and tech – all in one place.
          </p>
          <button
            onClick={() => handleItemClick('shoes')}
            className="bg-[#00ADB5] text-[#EEEEEE] px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#008E9B] transition-colors shadow-lg"
          >
            Shop Now
          </button>
        </div>
      </section>

      {/* Intro Section */}
      <section className="max-w-5xl mx-auto text-center px-4 py-16">
        <h2 className="text-3xl font-bold text-[#EEEEEE] mb-4">Handpicked Categories</h2>
        <p className="text-[#b5b5b5] text-lg">
          Whether you're looking to upgrade your wardrobe, accessorize with elegance, or get the latest gadgets — our curated selections have something for everyone.
        </p>
      </section>

      {/* Category Grid */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {productCategories.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default MainPage;