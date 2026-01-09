import { motion } from "framer-motion";
import { Link } from "react-router";
import { FiArrowRight, FiPhone, FiMessageCircle } from "react-icons/fi";
import Container from "../Shared/Container";

const CallToAction = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
      <Container>
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Join thousands of satisfied customers who have achieved their
              financial goals with LoanLink. Apply now and get approved in
              minutes!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <Link
              to="/all-loans-options"
              className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center group"
            >
              Apply for Loan Now
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors flex items-center"
            >
              <FiPhone className="mr-2" />
              Talk to Expert
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">24 Hours</div>
              <div className="text-white/80">Quick Approval</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">3.5% APR</div>
              <div className="text-white/80">Starting Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">$2M</div>
              <div className="text-white/80">Maximum Loan</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex justify-center items-center space-x-8 text-white/80"
          >
            <div className="flex items-center">
              <FiMessageCircle className="mr-2" />
              <span className="text-sm">24/7 Support</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white/60 rounded-full mr-2"></div>
              <span className="text-sm">No Hidden Fees</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white/60 rounded-full mr-2"></div>
              <span className="text-sm">Secure & Safe</span>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default CallToAction;
