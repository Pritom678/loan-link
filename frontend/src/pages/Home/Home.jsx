import CustomerFeedbackAuto from "../../components/Home/CustomerFeedbackAuto";
import HeroBanner from "../../components/Home/HeroBanner";
import HowItWorks from "../../components/Home/HowItWorks";
import LoanOption from "../../components/Home/LoanOption";

const Home = () => {
  return (
    <div>
      <HeroBanner />
      <LoanOption />
      <HowItWorks />
      <CustomerFeedbackAuto/>
    </div>
  );
};

export default Home;
