import { motion } from "framer-motion";
import CustomerFeedbackAuto from "../../components/Home/CustomerFeedbackAuto";
import HeroBanner from "../../components/Home/HeroBanner";
import HowItWorks from "../../components/Home/HowItWorks";
import LoanOption from "../../components/Home/LoanOption";

const Home = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="overflow-hidden mt-[-94px]">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.6 }}
      >
        <HeroBanner />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <LoanOption />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <HowItWorks />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <CustomerFeedbackAuto />
      </motion.div>
    </div>
  );
};

export default Home;

