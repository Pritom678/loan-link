import React, { useState, useEffect } from "react";

const feedbacks = [
  {
    name: "John Doe",
    feedback: "Getting a loan was so fast and easy! Highly recommend this platform.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Jane Smith",
    feedback: "The approval process was smooth, and the team was very supportive.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Michael Brown",
    feedback: "I received the funds quickly and without any hassle. Great service!",
    image: "https://randomuser.me/api/portraits/men/54.jpg",
  },
];

const CustomerFeedbackAuto = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === feedbacks.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-8">What Our Customers Say</h2>

        <div className="relative overflow-hidden rounded-2xl">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {feedbacks.map((item, index) => (
              <div
                key={index}
                className="min-w-full bg-white p-8 shadow-md flex flex-col items-center"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-full mb-4 object-cover"
                />
                <p className="text-gray-600 mb-4">{item.feedback}</p>
                <h3 className="font-semibold">{item.name}</h3>
              </div>
            ))}
          </div>

          {/* Navigation buttons */}
          <button
            onClick={() =>
              setCurrentIndex(currentIndex === 0 ? feedbacks.length - 1 : currentIndex - 1)
            }
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 text-2xl"
          >
            ‹
          </button>
          <button
            onClick={() =>
              setCurrentIndex(currentIndex === feedbacks.length - 1 ? 0 : currentIndex + 1)
            }
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 text-2xl"
          >
            ›
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-4">
          {feedbacks.map((_, index) => (
            <span
              key={index}
              className={`h-2 w-2 rounded-full mx-1 cursor-pointer ${
                index === currentIndex ? "bg-blue-500" : "bg-gray-300"
              }`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerFeedbackAuto;
