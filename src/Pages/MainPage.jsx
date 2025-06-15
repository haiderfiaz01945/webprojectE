import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();

  const productCategories = [
    {
      id: 1,
      name: 'Shoes',
      imageUrl: 'https://i.pinimg.com/736x/ce/af/21/ceaf21c671cc9b4ed6c9c68adcac1d2b.jpg',
      description: 'Step up your style with our versatile footwear collection.'
    },
    {
      id: 2,
      name: 'Watches',
      imageUrl: 'https://i.pinimg.com/736x/f0/3a/ae/f03aae15ec9bdd0060b563a3b8734dfa.jpg',
      description: 'Premium watches blending tradition with modern trends.'
    },
    {
      id: 3,
      name: 'Phones',
      imageUrl: 'https://i.pinimg.com/736x/3b/3e/1c/3b3e1cc19e6c2fde5c3d27161307b10f.jpg',
      description: 'Cutting-edge smartphones to keep you connected.'
    },
    {
      id: 4,
      name: 'Clothing',
      imageUrl: 'https://i.pinimg.com/736x/85/f5/ab/85f5ab828c6283e80bf92d97651a15ab.jpg',
      description: 'Modern clothing that blends comfort with style.'
    }
  ];

  const handleItemClick = (itemName) => {
    navigate(`/item/${itemName.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-[#222831] p-6">
      {/* Bento Grid Container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Hero Card - Spanning 2 columns */}
        <div 
          className="md:col-span-2 row-span-2 rounded-3xl overflow-hidden relative group"
          onClick={() => handleItemClick('shoes')}
        >
          <div className="absolute inset-0 bg-[#00ADB5]/20 z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80"
            alt="Hero"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 z-20 p-8">
            <h1 className="text-4xl font-bold text-[#EEEEEE] mb-2">Elite Horizon</h1>
            <p className="text-[#b5b5b5] text-lg max-w-md">Premium selections of footwear, timepieces, and tech</p>
            <button className="mt-4 bg-[#00ADB5] text-[#EEEEEE] px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#008E9B] transition-colors">
              Explore Collections
            </button>
          </div>
        </div>

        {/* Featured Category 1 */}
        <div 
          className="rounded-3xl overflow-hidden relative group cursor-pointer"
          onClick={() => handleItemClick(productCategories[0].name)}
        >
          <div className="absolute inset-0 bg-[#393E46]/60 z-10"></div>
          <img
            src={productCategories[0].imageUrl}
            alt={productCategories[0].name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute bottom-0 left-0 z-20 p-6">
            <h3 className="text-xl font-bold text-[#EEEEEE]">{productCategories[0].name}</h3>
            <p className="text-[#b5b5b5] text-sm">{productCategories[0].description}</p>
          </div>
        </div>

        {/* Featured Category 2 */}
        <div 
          className="rounded-3xl overflow-hidden relative group cursor-pointer"
          onClick={() => handleItemClick(productCategories[1].name)}
        >
          <div className="absolute inset-0 bg-[#393E46]/60 z-10"></div>
          <img
            src={productCategories[1].imageUrl}
            alt={productCategories[1].name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute bottom-0 left-0 z-20 p-6">
            <h3 className="text-xl font-bold text-[#EEEEEE]">{productCategories[1].name}</h3>
            <p className="text-[#b5b5b5] text-sm">{productCategories[1].description}</p>
          </div>
        </div>

        {/* Text Card */}
        <div className="md:col-span-2 rounded-3xl bg-[#393E46] p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-[#EEEEEE] mb-4">Curated Excellence</h2>
          <p className="text-[#b5b5b5] mb-6">
            Each item in our collection is hand-selected for quality, design, and innovation. We bridge the gap between luxury and accessibility.
          </p>
          <button 
            onClick={() => handleItemClick('watches')}
            className="self-start bg-[#00ADB5] text-[#EEEEEE] px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#008E9B] transition-colors"
          >
            Discover More
          </button>
        </div>

        {/* Featured Category 3 */}
        <div 
          className="rounded-3xl overflow-hidden relative group cursor-pointer"
          onClick={() => handleItemClick(productCategories[2].name)}
        >
          <div className="absolute inset-0 bg-[#393E46]/60 z-10"></div>
          <img
            src={productCategories[2].imageUrl}
            alt={productCategories[2].name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute bottom-0 left-0 z-20 p-6">
            <h3 className="text-xl font-bold text-[#EEEEEE]">{productCategories[2].name}</h3>
            <p className="text-[#b5b5b5] text-sm">{productCategories[2].description}</p>
          </div>
        </div>

        {/* Featured Category 4 */}
        <div 
          className="rounded-3xl overflow-hidden relative group cursor-pointer"
          onClick={() => handleItemClick(productCategories[3].name)}
        >
          <div className="absolute inset-0 bg-[#393E46]/60 z-10"></div>
          <img
            src={productCategories[3].imageUrl}
            alt={productCategories[3].name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute bottom-0 left-0 z-20 p-6">
            <h3 className="text-xl font-bold text-[#EEEEEE]">{productCategories[3].name}</h3>
            <p className="text-[#b5b5b5] text-sm">{productCategories[3].description}</p>
          </div>
        </div>

        {/* CTA Card */}
        <div className="md:col-span-2 rounded-3xl bg-gradient-to-br from-[#00ADB5] to-[#008E9B] p-8 flex flex-col justify-center items-center text-center">
          <h2 className="text-2xl font-bold text-[#EEEEEE] mb-4">Ready to Elevate Your Style?</h2>
          <p className="text-[#EEEEEE]/90 mb-6 max-w-md">
            Join thousands of satisfied customers who trust Elite Horizon for their premium lifestyle needs.
          </p>
          <button 
            onClick={() => handleItemClick('clothing')}
            className="bg-[#222831] text-[#EEEEEE] px-8 py-3 rounded-lg font-semibold hover:bg-[#393E46] transition-colors"
          >
            Start Shopping
          </button>
        </div>

      </div>
    </div>
  );
};

export default MainPage;