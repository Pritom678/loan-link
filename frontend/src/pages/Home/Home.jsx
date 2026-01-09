import { motion } from "framer-motion";
import CustomerFeedbackAuto from "../../components/Home/CustomerFeedbackAuto";
import HeroBanner from "../../components/Home/HeroBanner";
import HowItWorks from "../../components/Home/HowItWorks";
import LoanOption from "../../components/Home/LoanOption";
import Features from "../../components/Home/Features";
import Services from "../../components/Home/Services";
import Statistics from "../../components/Home/Statistics";
import FAQ from "../../components/Home/FAQ";
import Newsletter from "../../components/Home/Newsletter";
import CallToAction from "../../components/Home/CallToAction";

const Home = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
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

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Features />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Services />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <Statistics />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <FAQ />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        <Newsletter />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <CallToAction />
      </motion.div>
    </div>
  );
};

export default Home;
