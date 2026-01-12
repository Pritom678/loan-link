import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router";
import {
  FiDollarSign,
  FiClock,
  FiShield,
  FiTrendingUp,
  FiCheckCircle,
  FiArrowRight,
  FiPlay,
} from "react-icons/fi";

const HeroBanner = () => {
  const navigate = useNavigate();
  const [currentStat, setCurrentStat] = useState(0);

  const stats = [
    { label: "Loans Approved", value: "10,000+", icon: FiCheckCircle },
    { label: "Happy Customers", value: "8,500+", icon: FiTrendingUp },
    { label: "Average Approval Time", value: "24hrs", icon: FiClock },
    { label: "Success Rate", value: "95%", icon: FiShield },
  ];

  const features = [
    { icon: FiClock, text: "Quick 24-hour approval" },
    { icon: FiShield, text: "Secure & encrypted process" },
    { icon: FiDollarSign, text: "Competitive interest rates" },
    { icon: FiTrendingUp, text: "Flexible repayment terms" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [stats.length]);

  return (
    <section className="relative min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-pulse dark:opacity-20"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000 dark:opacity-20"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000 dark:opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-16 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 dark:bg-primary/20 dark:border-primary/30 rounded-full text-primary font-medium text-sm"
            >
              <FiTrendingUp className="w-4 h-4 mr-2" />
              #1 Trusted Loan Platform
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
              >
                Your Financial
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                  {" "}
                  Dreams{" "}
                </span>
                Start Here
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed"
              >
                Get instant access to personalized loan options with competitive
                rates, fast approval, and transparent terms. Your financial
                journey begins with LoanLink.
              </motion.p>
            </div>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 gap-4"
            >
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                    {feature.text}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={() => navigate("/all-loans-options")}
                className="group bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Apply for Loan Now
                <FiArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate("/all-loans-options")}
                className="group bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold px-8 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-primary/30 dark:hover:border-primary/50 transition-all duration-300 flex items-center justify-center"
              >
                <FiPlay className="mr-2 w-5 h-5" />
                Explore Options
              </button>
            </motion.div>
          </motion.div>

          {/* Right Content - Stats & Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main Stats Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  LoanLink Impact
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Trusted by thousands nationwide
                </p>
              </div>

              {/* Animated Stat Display */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStat}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center mb-8"
                >
                  <div className="w-16 h-16 bg-linear-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    {React.createElement(stats[currentStat].icon, {
                      className: "w-8 h-8 text-white",
                    })}
                  </div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {stats[currentStat].value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">
                    {stats[currentStat].label}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                      index === currentStat
                        ? "border-primary bg-primary/5 dark:bg-primary/10"
                        : "border-gray-100 dark:border-gray-600 hover:border-primary/30"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setCurrentStat(index)}
                  >
                    <div className="flex items-center space-x-3">
                      {React.createElement(stat.icon, {
                        className: `w-5 h-5 ${
                          index === currentStat
                            ? "text-primary"
                            : "text-gray-400"
                        }`,
                      })}
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 w-20 h-20 bg-linear-to-r from-secondary to-accent rounded-full flex items-center justify-center shadow-lg"
            >
              <FiDollarSign className="w-10 h-10 text-white" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-4 -left-4 w-16 h-16 bg-linear-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-lg"
            >
              <FiShield className="w-8 h-8 text-white" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-20 fill-white dark:fill-gray-900"
        >
          <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroBanner;
