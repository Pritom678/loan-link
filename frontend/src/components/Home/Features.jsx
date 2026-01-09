import { motion } from "framer-motion";
import {
  FiShield,
  FiClock,
  FiDollarSign,
  FiUsers,
  FiTrendingUp,
  FiAward,
} from "react-icons/fi";
import Container from "../Shared/Container";

const Features = () => {
  const features = [
    {
      icon: FiShield,
      title: "Secure & Safe",
      description:
        "Bank-level security with 256-bit SSL encryption to protect your data",
    },
    {
      icon: FiClock,
      title: "Quick Approval",
      description:
        "Get approved in as little as 24 hours with our streamlined process",
    },
    {
      icon: FiDollarSign,
      title: "Competitive Rates",
      description:
        "Industry-leading interest rates starting from as low as 3.5% APR",
    },
    {
      icon: FiUsers,
      title: "Expert Support",
      description: "Dedicated loan specialists available 24/7 to guide you",
    },
    {
      icon: FiTrendingUp,
      title: "Flexible Terms",
      description:
        "Choose repayment terms from 12 to 84 months that fit your budget",
    },
    {
      icon: FiAward,
      title: "Award Winning",
      description:
        "Recognized as 'Best Digital Lender' for 3 consecutive years",
    },
  ];

  return (
    <section className="py-16 bg-base-100">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Why Choose LoanLink?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're committed to providing you with the best lending experience
            through innovative technology and personalized service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-primary/10 rounded-lg mr-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Features;
