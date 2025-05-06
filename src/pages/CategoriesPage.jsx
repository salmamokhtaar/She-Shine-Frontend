import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const DEFAULT_IMAGE =
  "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg";

const CategoriesPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [allCategories, setAllCategories] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch("https://ecommercebackend-aa6n.onrender.com/api/products/categories");
        const data = await res.json();
        setAllCategories(data);

        // Apply filter if route has categoryName
        if (categoryName && data[categoryName]) {
          setFilteredProducts(data[categoryName]);
        } else if (!categoryName) {
          // default to showing all products
          const all = Object.values(data).flat();
          setFilteredProducts(all);
        }
      } catch (err) {
        console.error("Error loading categories", err);
      }
    };

    fetchAll();
  }, [categoryName]);

  const handleFilter = (name) => {
    navigate(`/category/${name}`);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold text-pink-700 mb-6 capitalize">
        {categoryName ? `${categoryName} Collection` : "All Products"}
      </h2>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => navigate("/category")}
          className={`px-4 py-1.5 rounded-full border ${
            !categoryName ? "bg-pink-600 text-white" : "bg-white text-pink-600 border-pink-600"
          }`}
        >
          All
        </button>
        {Object.keys(allCategories).map((cat) => (
          <button
            key={cat}
            onClick={() => handleFilter(cat)}
            className={`px-4 py-1.5 rounded-full border ${
              categoryName === cat
                ? "bg-pink-600 text-white"
                : "bg-white text-pink-600 border-pink-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition block"
            >
              <img
                src={product.image ? `https://ecommercebackend-aa6n.onrender.com${product.image}` : DEFAULT_IMAGE}
                alt={product.name}
                className="w-full h-56 object-contain mb-3"
              />
              <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                {product.name}
              </h3>
              <p className="text-pink-700 font-bold text-sm mt-1">
                ${product.price.toFixed(2)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
