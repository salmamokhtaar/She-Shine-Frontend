import React, { useState, useEffect } from "react";

const ProductInfo = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch("https://ecommercebackend-aa6n.onrender.com/api/products/featured");
        const data = await response.json();
        setFeaturedProducts(data);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (featuredProducts.length === 0) return null;

  return (
    <section className="container mx-auto px-6 lg:px-20 py-16 text-center">
      {/* Section Header */}
      <p className="text-pink-600 font-semibold text-sm uppercase">Featured Products</p>
      <h2 className="text-3xl font-bold text-gray-900 mt-1">Product Highlights</h2>
      <p className="text-gray-600 mt-2 text-sm max-w-xl mx-auto">
        Discover the latest and most popular products in our store. Click on each product to learn more.
      </p>

      {/* Main Layout */}
      <div className="relative flex flex-col lg:flex-row items-center justify-between mt-10">

        {/* Left - Product Image (no pink background) */}
        <div className="w-full lg:w-1/2 flex justify-center relative">
          <div className="w-[300px] h-[300px] flex items-center justify-center">
            <img
              src={`https://ecommercebackend-aa6n.onrender.com${featuredProducts[activeStep].image}`}
              alt={featuredProducts[activeStep].name}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Right - Timeline List */}
        <div className="w-full lg:w-1/2 flex flex-col space-y-6 relative">
          {/* Vertical Line */}
          <div className="absolute left-4 lg:left-8 h-full w-1 bg-gray-300 rounded-full"></div>

          {featuredProducts.map((product, index) => (
            <div
              key={product._id}
              onClick={() => setActiveStep(index)}
              className={`relative flex items-center space-x-4 p-4 rounded-lg cursor-pointer transition ${
                activeStep === index ? "bg-white shadow-md" : "opacity-50"
              }`}
            >
              {/* Step Dot */}
              <div
                className={`w-3 h-3 rounded-full ${
                  activeStep === index ? "bg-pink-500" : "bg-gray-400"
                }`}
              ></div>

              {/* Only show image for active */}
              {activeStep === index && (
                <img
                  src={`https://ecommercebackend-aa6n.onrender.com${product.image}`}
                  alt={product.name}
                  className="w-14 h-14 rounded-lg object-cover"
                />
              )}

              {/* Product Info */}
              <div>
                <h4
                  className={`font-semibold ${
                    activeStep === index ? "text-gray-900" : "text-gray-600"
                  }`}
                >
                  {product.name}
                </h4>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {product.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductInfo;
