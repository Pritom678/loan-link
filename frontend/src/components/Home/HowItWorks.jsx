import React from "react";
import {
  FiDollarSign,
  FiEdit3,
  FiCheckCircle,
  FiCreditCard,
} from "react-icons/fi";

const steps = [
  {
    title: "Choose a Loan",
    description:
      "Select the loan that best fits your needs from our wide range of options.",
    icon: FiDollarSign,
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Apply Online",
    description:
      "Fill out a simple application form with your details in minutes.",
    icon: FiEdit3,
    color: "from-green-500 to-green-600",
  },
  {
    title: "Get Approval",
    description:
      "Our team will review your application and approve it quickly.",
    icon: FiCheckCircle,
    color: "from-orange-500 to-orange-600",
  },
  {
    title: "Receive Funds",
    description:
      "Once approved, the funds will be transferred to your account instantly.",
    icon: FiCreditCard,
    color: "from-purple-500 to-purple-600",
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
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary/10 rounded-xl">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-500">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
