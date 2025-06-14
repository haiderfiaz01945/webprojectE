import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProducts } from '../../firebaseService';
import { useCart } from '../Componenets/CartContext';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProducts();
        const foundProduct = data.find((p) => p.id === id);
        setProduct(foundProduct || null);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      });
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-12 w-12 rounded-full border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12 text-red-600">
        <h2 className="text-2xl font-semibold">Product Not Found</h2>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-white py-12 px-6 lg:px-20 min-h-screen">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-2xl shadow-xl p-8">
        {/* Product Image */}
        <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[450px] object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>

            <p className="text-md text-gray-600 mb-2">
              <span className="font-semibold text-gray-800">Category:</span> {product.category}
            </p>

            {product.subcategory && (
              <p className="text-md text-gray-600 mb-2">
                <span className="font-semibold text-gray-800">Subcategory:</span> {product.subcategory}
              </p>
            )}

            <p className="text-3xl font-bold text-blue-600 mt-4 mb-6">${product.price}</p>

            <p className="text-gray-700 leading-relaxed">
              {product.description || 'This product has no description yet, but it’s awesome!'}
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-6 py-3 rounded-xl shadow-lg transition"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-6 py-3 rounded-xl shadow-lg transition"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
