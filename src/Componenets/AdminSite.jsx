import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { addData, fetchProducts } from '../../firebaseService';

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
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">Product Management</h2>

      {/* Add Product Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-10">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Add New Product</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name*</label>
              <input
                type="text"
                name="name"
                placeholder="Enter product name"
                value={product.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                <input
                  type="number"
                  name="price"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={product.price}
                  onChange={handleChange}
                  className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL*</label>
              <input
                type="url"
                name="image"
                placeholder="https://example.com/image.jpg"
                value={product.image}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
              <select
                name="category"
                value={product.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select Category</option>
                {Object.keys(categories).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {product.category && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                <select
                  name="subcategory"
                  value={product.subcategory}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Subcategory (Optional)</option>
                  {categories[product.category]?.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* View Orders Button */}
          <div className="mt-6 text-right">
            <Link
              to="/orders"
              className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold py-2 px-4 rounded-md shadow"
            >
              📦 View Orders
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {isSubmitting ? 'Adding...' : 'Add Product'}
          </button>
        </form>
      </div>

      {/* Product List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">Product Inventory</h3>

        {products.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No products found. Add some products to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id} className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-100 overflow-hidden">
                  <img 
                    src={p.image} 
                    alt={p.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-bold text-gray-800">{p.name}</h4>
                    <span className="text-lg font-bold text-indigo-600">${parseFloat(p.price).toFixed(2)}</span>
                  </div>
                  <div className="mt-2">
                    <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                      {p.category}
                    </span>
                    {p.subcategory && (
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full ml-1">
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
  );
};

export default AdminSite;
