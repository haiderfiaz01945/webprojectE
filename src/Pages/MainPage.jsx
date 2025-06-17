import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Import the CSS file

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
    <div className="main-container">
      {/* Bento Grid Container */}
      <div className="grid-container">
        
        {/* Hero Card - Spanning 2 columns */}
        <div 
          className="grid-item hero-card"
          onClick={() => handleItemClick('shoes')}
        >
          <div className="hero-overlay"></div>
          <img
            src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80"
            alt="Hero"
            className="hero-image"
          />
          <div className="hero-content">
            <h1 className="hero-title">Elite Horizon</h1>
            <p className="hero-description">Premium selections of footwear, timepieces, and tech</p>
            <button className="hero-button">
              Explore Collections
            </button>
          </div>
        </div>

        {/* Featured Category 1 */}
        <div 
          className="grid-item category-card"
          onClick={() => handleItemClick(productCategories[0].name)}
        >
          <div className="category-overlay"></div>
          <img
            src={productCategories[0].imageUrl}
            alt={productCategories[0].name}
            className="category-image"
          />
          <div className="category-content">
            <h3 className="category-title">{productCategories[0].name}</h3>
            <p className="category-description">{productCategories[0].description}</p>
          </div>
        </div>

        {/* Featured Category 2 */}
        <div 
          className="grid-item category-card"
          onClick={() => handleItemClick(productCategories[1].name)}
        >
          <div className="category-overlay"></div>
          <img
            src={productCategories[1].imageUrl}
            alt={productCategories[1].name}
            className="category-image"
          />
          <div className="category-content">
            <h3 className="category-title">{productCategories[1].name}</h3>
            <p className="category-description">{productCategories[1].description}</p>
          </div>
        </div>

        {/* Text Card */}
        <div className="grid-item text-card">
          <h2 className="text-card-title">Curated Excellence</h2>
          <p className="text-card-description">
            Each item in our collection is hand-selected for quality, design, and innovation. We bridge the gap between luxury and accessibility.
          </p>
          <button 
            onClick={() => handleItemClick('watches')}
            className="text-card-button"
          >
            Discover More
          </button>
        </div>

        {/* Featured Category 3 */}
        <div 
          className="grid-item category-card"
          onClick={() => handleItemClick(productCategories[2].name)}
        >
          <div className="category-overlay"></div>
          <img
            src={productCategories[2].imageUrl}
            alt={productCategories[2].name}
            className="category-image"
          />
          <div className="category-content">
            <h3 className="category-title">{productCategories[2].name}</h3>
            <p className="category-description">{productCategories[2].description}</p>
          </div>
        </div>

        {/* Featured Category 4 */}
        <div 
          className="grid-item category-card"
          onClick={() => handleItemClick(productCategories[3].name)}
        >
          <div className="category-overlay"></div>
          <img
            src={productCategories[3].imageUrl}
            alt={productCategories[3].name}
            className="category-image"
          />
          <div className="category-content">
            <h3 className="category-title">{productCategories[3].name}</h3>
            <p className="category-description">{productCategories[3].description}</p>
          </div>
        </div>

        {/* CTA Card */}
        <div className="grid-item cta-card">
          <h2 className="cta-title">Ready to Elevate Your Style?</h2>
          <p className="cta-description">
            Join thousands of satisfied customers who trust Elite Horizon for their premium lifestyle needs.
          </p>
          <button 
            onClick={() => handleItemClick('clothing')}
            className="cta-button"
          >
            Start Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;

 