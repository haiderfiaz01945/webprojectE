import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { addData, fetchProducts } from '../../firebaseService';
import { FiPlus, FiPackage, FiDollarSign, FiImage, FiTag, FiGrid, FiTruck } from 'react-icons/fi';

const AdminSite = () => {
  const [product, setProduct] = useState({ 
    name: '', 
    price: '', 
    image: '', 
    category: '',
    subcategory: '' 
  });
  const [products, setProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = {
    'Phones': ['Smartphones', 'Accessories', 'Cases'],
    'Watches': ['Smart Watches', 'Analog', 'Digital'],
    'Shoes': ['Sneakers', 'Boots', 'Sandals', 'Formal'],
    'Clothing': ['Men', 'Women', 'Kids', 'Accessories']
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'category' ? { subcategory: '' } : {})
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, price, image, category } = product;

    if (!name || !price || !image || !category) {
      alert('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await addData({
        ...product,
        price: parseFloat(price)
      });
      setProduct({ name: '', price: '', image: '', category: '', subcategory: '' });
      await loadProducts();
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#222831] py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-[#EEEEEE]">Product Management</h2>
          <Link
            to="/orders"
            className="flex items-center bg-[#00ADB5] hover:bg-[#008E9B] text-[#EEEEEE] py-2 px-4 rounded-lg transition-colors"
          >
            <FiTruck className="mr-2" />
            View Orders
          </Link>
        </div>

        {/* Add Product Form */}
        <div className="bg-[#393E46] p-6 rounded-xl shadow-lg mb-10 border border-[#393E46]/50">
          <h3 className="text-xl font-semibold mb-4 text-[#EEEEEE] flex items-center">
            <FiPlus className="mr-2" />
            Add New Product
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-[#EEEEEE] mb-2 flex items-center">
                  <FiPackage className="mr-2" />
                  Product Name*
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  value={product.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#222831] border border-[#222831] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5] text-[#EEEEEE] placeholder-[#b5b5b5]"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-[#EEEEEE] mb-2 flex items-center">
                  <FiDollarSign className="mr-2" />
                  Price*
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#b5b5b5]">$</span>
                  <input
                    type="number"
                    name="price"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={product.price}
                    onChange={handleChange}
                    className="w-full pl-10 px-4 py-3 bg-[#222831] border border-[#222831] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5] text-[#EEEEEE] placeholder-[#b5b5b5]"
                    required
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-[#EEEEEE] mb-2 flex items-center">
                  <FiImage className="mr-2" />
                  Image URL*
                </label>
                <input
                  type="url"
                  name="image"
                  placeholder="https://example.com/image.jpg"
                  value={product.image}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#222831] border border-[#222831] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5] text-[#EEEEEE] placeholder-[#b5b5b5]"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-[#EEEEEE] mb-2 flex items-center">
                  <FiTag className="mr-2" />
                  Category*
                </label>
                <select
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#222831] border border-[#222831] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5] text-[#EEEEEE]"
                  required
                >
                  <option value="" className="bg-[#393E46]">Select Category</option>
                  {Object.keys(categories).map(cat => (
                    <option key={cat} value={cat} className="bg-[#393E46]">{cat}</option>
                  ))}
                </select>
              </div>

              {/* Subcategory */}
              {product.category && (
                <div>
                  <label className="block text-sm font-medium text-[#EEEEEE] mb-2 flex items-center">
                    <FiGrid className="mr-2" />
                    Subcategory
                  </label>
                  <select
                    name="subcategory"
                    value={product.subcategory}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#222831] border border-[#222831] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5] text-[#EEEEEE]"
                  >
                    <option value="" className="bg-[#393E46]">Select Subcategory (Optional)</option>
                    {categories[product.category]?.map(sub => (
                      <option key={sub} value={sub} className="bg-[#393E46]">{sub}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full mt-6 py-3 px-4 rounded-lg font-medium flex items-center justify-center ${
                isSubmitting 
                  ? 'bg-[#00ADB5]/70 cursor-not-allowed' 
                  : 'bg-[#00ADB5] hover:bg-[#008E9B]'
              } text-[#EEEEEE] transition-colors`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Product...
                </>
              ) : (
                'Add Product'
              )}
            </button>
          </form>
        </div>

        {/* Product List */}
        <div className="bg-[#393E46] p-6 rounded-xl shadow-lg border border-[#393E46]/50">
          <h3 className="text-xl font-semibold mb-6 text-[#EEEEEE]">Product Inventory</h3>

          {products.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-[#b5b5b5]">No products found. Add some products to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p) => (
                <div key={p.id} className="bg-[#222831] rounded-xl overflow-hidden shadow hover:shadow-xl transition-all">
                  <div className="h-48 bg-[#393E46] overflow-hidden">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h4 className="text-lg font-semibold text-[#EEEEEE]">{p.name}</h4>
                      <span className="text-lg font-bold text-[#00ADB5]">${parseFloat(p.price).toFixed(2)}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-block bg-[#393E46] text-[#00ADB5] text-xs px-2 py-1 rounded-full">
                        {p.category}
                      </span>
                      {p.subcategory && (
                        <span className="inline-block bg-[#393E46] text-[#b5b5b5] text-xs px-2 py-1 rounded-full">
                          {p.subcategory}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSite;