import React, { useState, useEffect } from 'react';
import img from '../assets/women.png';
import imgs from '../assets/yy.png';
import imgss from '../assets/gggg.png';

const slides = [
  {
    image: img,
    title: 'Shine Bright, Beautifully',
    subtitle: 'Celebrate every woman’s glow and every child’s smile with styles that sparkle at She & Shine.',
    button: 'Shop Women & Kids'
  },
  {
    image: imgs,
    title: 'Fashion for Every Moment',
    subtitle: 'From little adventures to grand events, dress your loved ones in confidence and charm.',
    button: 'Explore Collections'
  },
  {
    image: imgss,
    title: 'Style That Grows With You',
    subtitle: 'Discover timeless pieces for women and children — made to inspire, made to shine.',
    button: 'Discover More'
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000); // Change slide every 3 seconds
    return () => clearInterval(slideInterval);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative w-full overflow-hidden sm:h-[70vh] h-[90vh] bg-pink-50">
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out flex flex-col md:flex-row items-center justify-center ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Text Section */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-start text-left p-4 md:p-8 md:pl-12 space-y-4">
              <h1 className="md:text-3xl text-xl sm:font-bold font-extrabold sm:mt-0 mt-[50px] mb-2 sm:ml-30 text-pink-700">{slide.title}</h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed sm:ml-30">{slide.subtitle}</p>
              <button className="bg-pink-500 hover:bg-pink-400 transition duration-300 sm:ml-30 text-white font-bold py-3 px-6 rounded-full">
                {slide.button}
              </button>
            </div>

            {/* Image Section */}
            <div className="w-full sm:mr-30 md:w-1/2 flex justify-center items-center p-4">
              <img
                src={slide.image}
                alt={slide.title}
                className="object-contain bg-pink-50 w-[100%] max-h-100"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? 'bg-pink-600' : 'bg-gray-300'
            }`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default Hero;
