import { motion } from "framer-motion";
import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import { Link } from "react-router";
import Container from "../../components/Shared/Container";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "How quickly can I get approved for a loan?",
      answer:
        "Most loan applications are processed within 24-48 hours. For pre-qualified applicants with complete documentation, approval can happen in as little as 2 hours during business hours.",
    },
    {
      question: "What documents do I need to apply?",
      answer:
        "You'll need a valid ID, proof of income (pay stubs or tax returns), bank statements, and employment verification. Additional documents may be required based on the loan type.",
    },
    {
      question: "What is the minimum credit score required?",
      answer:
        "We work with borrowers across the credit spectrum. While a higher credit score (650+) gets you better rates, we have programs for those with scores as low as 580.",
    },
    {
      question: "Can I pay off my loan early without penalties?",
      answer:
        "Yes! All our loans come with no prepayment penalties. You can pay off your loan early and save on interest without any additional fees.",
    },
    {
      question: "How much can I borrow?",
      answer:
        "Loan amounts vary by type: Personal loans up to $100K, Auto loans up to $150K, Home loans up to $2M, and Business loans up to $500K, subject to qualification.",
    },
    {
      question: "Is my personal information secure?",
      answer:
        "Absolutely. We use bank-level 256-bit SSL encryption and are SOC 2 Type II certified. Your data is protected with the highest security standards in the industry.",
    },
    {
      question: "What are your interest rates?",
      answer:
        "Rates vary based on loan type, amount, term, and creditworthiness. Personal loans start at 5.99% APR, auto loans at 3.49% APR, and mortgages at current market rates.",
    },
    {
      question: "Can I check my loan status online?",
      answer:
        "Yes! Once you apply, you'll have access to our customer portal where you can track your application status, upload documents, and manage your account 24/7.",
    },
    {
      question: "What happens if I miss a payment?",
      answer:
        "We understand that financial situations can change. Contact us immediately if you're having trouble making payments. We offer various assistance programs and payment modification options.",
    },
    {
      question: "Do you offer refinancing options?",
      answer:
        "Yes, we offer refinancing for existing loans to help you get better rates or terms. Contact our refinancing specialists to see if you qualify for better terms.",
    },
  ];

  return (
    <div className="pt-16">
      <Container>
        <div className="py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to the most common questions about our loan services,
              application process, and terms.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="mb-4"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <button
                    onClick={() =>
                      setOpenIndex(openIndex === index ? -1 : index)
                    }
                    className="faq-button w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-800 faq-question-text">
                      {faq.question}
                    </span>
                    {openIndex === index ? (
                      <FiMinus className="w-5 h-5 text-primary" />
                    ) : (
                      <FiPlus className="w-5 h-5 text-primary" />
                    )}
                  </button>

                  <motion.div
                    initial={false}
                    animate={{
                      height: openIndex === index ? "auto" : 0,
                      opacity: openIndex === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-gray-600 faq-answer-text">
                      {faq.answer}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Link
              to="/contact"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors"
            >
              Contact Our Support Team
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default FAQ;
