import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProducts } from '../../firebaseService';
import { useCart } from '../Componenets/CartContext';
import { FiShoppingCart, FiArrowLeft, FiStar, FiTruck, FiShield } from 'react-icons/fi';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProducts();
        const foundProduct = data.find((p) => p.id === id);
        setProduct(foundProduct || null);
        if (foundProduct?.images) {
          setSelectedImage(0);
        }
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
        image: product.images ? product.images[0] : product.image,
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
      <div className="flex justify-center items-center h-screen bg-[#222831]">
        <div className="animate-spin h-12 w-12 rounded-full border-t-4 border-b-4 border-[#00ADB5]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12 text-[#EEEEEE] bg-[#222831] min-h-screen">
        <h2 className="text-2xl font-semibold mb-4">Product Not Found</h2>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center mx-auto px-6 py-2 bg-[#00ADB5] text-[#EEEEEE] rounded-lg hover:bg-[#008E9B] transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to Products
        </button>
      </div>
    );
  }

  // Use images array if available, otherwise fall back to single image
  const productImages = product.images || [product.image];

  return (
    <div className="bg-[#222831] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#00ADB5] hover:text-[#008E9B] mb-6 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to {product.category}
        </button>

        {/* Product Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#393E46] rounded-xl shadow-2xl overflow-hidden">
          {/* Product Images */}
          <div className="p-6">
            {/* Main Image */}
            <div className="rounded-lg overflow-hidden bg-[#222831] mb-4">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-contain"
              />
            </div>

            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`rounded-md overflow-hidden border-2 ${selectedImage === index ? 'border-[#00ADB5]' : 'border-transparent'}`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-6 flex flex-col">
            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-[#EEEEEE] mb-2">{product.name}</h1>
              
              {/* Rating */}
              {product.rating && (
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`${i < Math.floor(product.rating) ? 'fill-current' : ''}`}
                      />
                    ))}
                  </div>
                  <span className="text-[#b5b5b5] text-sm">
                    {product.rating} ({product.reviewCount || 0} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-bold text-[#00ADB5]">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-[#b5b5b5] line-through ml-2">${product.originalPrice}</span>
                )}
                {product.discount && (
                  <span className="ml-2 bg-red-500 text-[#EEEEEE] text-sm px-2 py-1 rounded">
                    {product.discount}% OFF
                  </span>
                )}
              </div>

              {/* Category Info */}
              <div className="mb-6">
                <p className="text-md text-[#b5b5b5] mb-1">
                  <span className="font-semibold text-[#EEEEEE]">Category:</span> {product.category}
                </p>
                {product.subcategory && (
                  <p className="text-md text-[#b5b5b5]">
                    <span className="font-semibold text-[#EEEEEE]">Type:</span> {product.subcategory}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#EEEEEE] mb-2">Description</h3>
                <p className="text-[#b5b5b5] leading-relaxed">
                  {product.description || 'This premium product combines quality craftsmanship with modern design. Perfect for those who appreciate both style and functionality.'}
                </p>
              </div>

              {/* Features */}
              {product.features && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-[#EEEEEE] mb-2">Key Features</h3>
                  <ul className="text-[#b5b5b5] space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-[#00ADB5] mr-2">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Buttons and Info */}
            <div className="mt-auto">
              {/* Shipping Info */}
              <div className="flex items-center text-[#b5b5b5] mb-6">
                <FiTruck className="mr-2 text-[#00ADB5]" />
                <span>Free shipping on orders over $50</span>
              </div>

              {/* Warranty Info */}
              <div className="flex items-center text-[#b5b5b5] mb-8">
                <FiShield className="mr-2 text-[#00ADB5]" />
                <span>1-year manufacturer warranty</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center px-6 py-3 bg-[#00ADB5] hover:bg-[#008E9B] text-[#EEEEEE] rounded-lg font-medium transition-colors"
                >
                  <FiShoppingCart className="mr-2" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="px-6 py-3 bg-[#393E46] hover:bg-[#222831] border-2 border-[#00ADB5] text-[#EEEEEE] rounded-lg font-medium transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;