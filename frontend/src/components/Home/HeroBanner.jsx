import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";

// Hero slides data
const slides = [
  {
    id: 1,
    title: "Get Your Loan Quickly and Easily",
    description:
      "LoanLink provides fast and transparent loan solutions to achieve your financial goals.",
    image: "https://i.ibb.co.com/PGjW5PzX/loanbanner.jpg",
  },
  {
    id: 2,
    title: "Flexible Loan Options for Everyone",
    description: "Choose the loan that fits your needs and apply in minutes.",
    image: "https://i.ibb.co.com/Vpzbcq6V/loanbanner2.jpg",
  },
  {
    id: 3,
    title: "Trusted by Thousands of Customers",
    description: "Join our community and take control of your finances today.",
    image: "https://i.ibb.co.com/6Jr74vvh/loanbanner3.jpg",
  },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  // Change slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[80vh] md:h-screen mt-[-100px] overflow-hidden">
      <AnimatePresence mode="wait">
        {slides.map((slide, index) =>
          index === current ? (
            <motion.div
              key={slide.id}
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center filter brightness-50"
                style={{ backgroundImage: `url(${slide.image})` }}
              ></div>

              {/* Content */}
              <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center text-white">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl mb-6 max-w-lg">
                  {slide.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => navigate("/all-loans-options")}
                    className="bg-accent hover:bg-secondary transition-colors text-white font-semibold px-6 py-3 rounded-lg"
                  >
                    Apply for Loan
                  </button>
                  <button
                    onClick={() => navigate("/all-loans-options")}
                    className="bg-white hover:bg-gray-100 transition-colors text-gray-900 font-semibold px-6 py-3 rounded-lg"
                  >
                    Explore Loans
                  </button>
                </div>
              </div>
            </motion.div>
          ) : null
        )}
      </AnimatePresence>
    </section>
  );
};

export default HeroBanner;
