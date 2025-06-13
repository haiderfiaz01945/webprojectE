import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../../firebaseService';
import { useCart } from '../Componenets/CartContext';

const Watches = () => {
  const [Watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      const WatchesData = data.filter(
        product => product.category?.trim().toLowerCase() === "watch"
      );
      setWatches(WatchesData);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (Watches.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-700">No Watches available</h3>
        <p className="text-gray-500 mt-2">Check back later for new arrivals</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Our Watch Collection</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Watches.map((shoe) => (
          <div 
            key={shoe.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => handleProductClick(shoe.id)}
          >
            <div className="h-64 overflow-hidden">
              <img 
                src={shoe.image} 
                alt={shoe.name} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{shoe.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{shoe.category}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-lg font-bold text-blue-600">${shoe.price}</span>
                <button 
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  onClick={(e) => handleAddToCart(e, shoe)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watches;
