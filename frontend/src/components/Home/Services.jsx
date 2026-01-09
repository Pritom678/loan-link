import { motion } from "framer-motion";
import {
  FiHome,
  FiBriefcase,
  FiTruck,
  FiBookOpen,
  FiCreditCard,
  FiTrendingUp,
} from "react-icons/fi";
import Container from "../Shared/Container";
import { Link } from "react-router";

const Services = () => {
  const services = [
    {
      icon: FiHome,
      title: "Home Loans",
      description:
        "Make your dream home a reality with our competitive mortgage rates and flexible terms.",
      features: ["Low interest rates", "Quick approval", "Flexible terms"],
    },
    {
      icon: FiBriefcase,
      title: "Business Loans",
      description:
        "Fuel your business growth with our tailored business financing solutions.",
      features: ["Up to $500K", "No collateral", "Fast funding"],
    },
    {
      icon: FiTruck,
      title: "Auto Loans",
      description:
        "Drive away with your dream car today with our auto financing options.",
      features: ["New & used cars", "Competitive rates", "Easy process"],
    },
    {
      icon: FiBookOpen,
      title: "Education Loans",
      description:
        "Invest in your future with our education loan programs for students.",
      features: ["Deferred payments", "Low rates", "Flexible terms"],
    },
    {
      icon: FiCreditCard,
      title: "Personal Loans",
      description:
        "Get the funds you need for any personal expense with our unsecured loans.",
      features: ["No collateral", "Quick approval", "Fixed rates"],
    },
    {
      icon: FiTrendingUp,
      title: "Investment Loans",
      description:
        "Leverage your investments with our specialized investment financing options.",
      features: ["Portfolio loans", "Margin financing", "Expert advice"],
    },
  ];

  return (
    <section className="py-16 bg-base-200">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Our Loan Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Whatever your financial needs, we have the right loan product for
            you. Explore our comprehensive range of lending solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full"
            >
              <div className="h-2 bg-primary service-top-bar"></div>

              <div className="p-6 flex flex-col grow">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg mr-4">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                </div>

                <p className="text-gray-600 mb-4 grow">{service.description}</p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <Link
                    to="/all-loans-options"
                    className="inline-block w-full text-center bg-primary text-white py-3 px-4 rounded-lg hover:bg-secondary transition-colors font-semibold"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Services;
