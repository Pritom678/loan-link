import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Container from "../Shared/Container";

const Statistics = () => {
  const [counts, setCounts] = useState({
    loans: 0,
    customers: 0,
    amount: 0,
    satisfaction: 0,
  });

  const finalCounts = {
    loans: 15000,
    customers: 50000,
    amount: 2.5, // in billions
    satisfaction: 98,
  };

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepTime = duration / steps;

    const intervals = Object.keys(finalCounts).map((key) => {
      const finalValue = finalCounts[key];
      const increment = finalValue / steps;
      let currentValue = 0;

      return setInterval(() => {
        currentValue += increment;
        if (currentValue >= finalValue) {
          currentValue = finalValue;
          clearInterval(intervals.find((interval) => interval === this));
        }
        setCounts((prev) => ({
          ...prev,
          [key]: key === "amount" ? currentValue : Math.floor(currentValue),
        }));
      }, stepTime);
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  const stats = [
    {
      number: counts.loans.toLocaleString(),
      suffix: "+",
      label: "Loans Approved",
      description: "Successfully funded loans",
    },
    {
      number: counts.customers.toLocaleString(),
      suffix: "+",
      label: "Happy Customers",
      description: "Satisfied borrowers nationwide",
    },
    {
      number: counts.amount.toFixed(1),
      suffix: "B+",
      label: "Amount Disbursed",
      description: "Total funds distributed",
    },
    {
      number: counts.satisfaction,
      suffix: "%",
      label: "Satisfaction Rate",
      description: "Customer satisfaction score",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Trusted by Thousands</h2>
          <p className="text-white/90 max-w-2xl mx-auto">
            Our numbers speak for themselves. Join thousands of satisfied
            customers who have achieved their financial goals with LoanLink.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="text-center"
            >
              <div className="text-5xl font-bold mb-2">
                {stat.number}
                {stat.suffix}
              </div>
              <div className="text-xl font-semibold mb-2">{stat.label}</div>
              <div className="text-white/80 text-sm">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Statistics;
