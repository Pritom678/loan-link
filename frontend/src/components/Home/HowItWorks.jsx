import React from "react";

const steps = [
  {
    title: "Choose a Loan",
    description:
      "Select the loan that best fits your needs from our wide range of options.",
    icon: "💰",
  },
  {
    title: "Apply Online",
    description:
      "Fill out a simple application form with your details in minutes.",
    icon: "📝",
  },
  {
    title: "Get Approval",
    description:
      "Our team will review your application and approve it quickly.",
    icon: "✅",
  },
  {
    title: "Receive Funds",
    description:
      "Once approved, the funds will be transferred to your account instantly.",
    icon: "🏦",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
        <p className="text-gray-600 mb-12">
          Getting a loan is simple and fast. Just follow these easy steps:
        </p>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-500">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
