import React from "react";
import { FaShippingFast, FaSmile, FaStar } from "react-icons/fa";

const features = [
  {
    icon: <FaShippingFast size={40} className="text-pink-600" />,
    title: "Fast & Free Shipping",
    description: "We deliver happiness fast — enjoy quick, free delivery on all orders.",
  },
  {
    icon: <FaSmile size={40} className="text-pink-600" />,
    title: "Made for Women & Kids",
    description: "Each collection is handpicked to celebrate confidence and comfort for all ages.",
  },
  {
    icon: <FaStar size={40} className="text-pink-600" />,
    title: "Stylish & Affordable",
    description: "Trendy, high-quality outfits that won’t break the bank — because you deserve both.",
  },
];

const WhySheAndShine = () => {
  return (
    <section className="py-16 bg-white text-center px-4">
      <p className="text-sm font-semibold text-pink-600 mb-2 uppercase">Why Shop With Us</p>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Why She & Shine?</h2>
      <p className="text-gray-600 max-w-xl mx-auto mb-10">
        Discover the values behind our fashion — comfort, confidence, and celebration. She & Shine
        brings together carefully curated designs for women and kids with a mission to empower.
      </p>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-pink-50 p-6 rounded-lg shadow-sm hover:shadow-md transition text-left"
          >
            <div className="mb-4">{feature.icon}</div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h4>
            <p className="text-sm text-gray-600">{feature.description}</p>
            <button className="mt-4 text-sm font-medium text-pink-600 hover:underline">
              Learn More →
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhySheAndShine;
