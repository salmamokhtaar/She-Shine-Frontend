import React from 'react';
import { FiShoppingBag, FiHeart, FiCreditCard, FiSmile } from 'react-icons/fi';

const steps = [
  {
    icon: <FiShoppingBag size={30} className="text-pink-600" />,
    title: 'Find Your Style',
    description: 'Explore charming collections for women and little ones made to inspire.'
  },
  {
    icon: <FiHeart size={30} className="text-pink-600" />,
    title: 'Add Your Favorites',
    description: 'Love it? Add it to your bag and keep your sparkle ready to shine.'
  },
  {
    icon: <FiCreditCard size={30} className="text-pink-600" />,
    title: 'Easy & Secure Checkout',
    description: 'Enjoy a quick, secure checkout with flexible payment options.'
  },
  {
    icon: <FiSmile size={30} className="text-pink-600" />,
    title: 'Delivered with Joy',
    description: 'Receive your beautiful finds right at your doorstep — happiness guaranteed.'
  }
];

const HowItWorks = () => {
  return (
    <section className="bg-white py-12">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-pink-600 font-semibold text-lg">HOW IT WORKS</h2>
        <h3 className="text-3xl font-bold text-gray-800 mb-4">A Shining Shopping Journey</h3>
        <p className="text-gray-600 mb-10">
          Experience shopping that’s made with love, style, and a sparkle — only at She & Shine.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="bg-pink-100 rounded-full p-4 mb-4">
                {step.icon}
              </div>
              <h4 className="text-xl font-semibold text-gray-800">{step.title}</h4>
              <p className="text-gray-600 text-sm text-center">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
