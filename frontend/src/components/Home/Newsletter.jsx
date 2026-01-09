import { motion } from "framer-motion";
import { useState } from "react";
import { FiMail, FiCheck } from "react-icons/fi";
import Container from "../Shared/Container";
import toast from "react-hot-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      toast.success("Successfully subscribed to our newsletter!");
      setEmail("");
    }, 1000);
  };

  return (
    <section className="py-16 newsletter-bg bg-gradient-to-r from-primary/10 to-secondary/10">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6">
              <FiMail className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-4xl font-bold mb-4 newsletter-text">
              Stay Updated with LoanLink
            </h2>
            <p className="text-lg mb-8 newsletter-text">
              Get the latest updates on loan rates, financial tips, and
              exclusive offers delivered straight to your inbox.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            {!isSubscribed ? (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              >
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors font-semibold"
                >
                  Subscribe
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center text-green-600">
                <FiCheck className="w-6 h-6 mr-2" />
                <span className="text-lg font-semibold">
                  Thank you for subscribing!
                </span>
              </div>
            )}

            <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                Weekly market updates
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                Exclusive loan offers
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                Financial tips & advice
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default Newsletter;
