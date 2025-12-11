import Button from "../components/Shared/Button/Button";
import { useNavigate } from "react-router";
import { FiAlertTriangle } from "react-icons/fi";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full h-screen flex items-center justify-center bg-gradient-to-r from-black/80 to-black/40 text-white overflow-hidden">

      {/* Background Blur Image */}
      <div className="absolute inset-0">
        <img
          src="https://i.ibb.co/MxThyD0X/house-coins-calculator-real-estate-investmen.jpg"
          className="w-full h-full object-cover opacity-20"
          alt="background"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl">
        <div className="flex justify-center mb-4">
          <span className="p-4 bg-yellow-200/20 rounded-full text-yellow-400">
            <FiAlertTriangle className="text-4xl" />
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Something Went Wrong
        </h1>

        <p className="text-gray-200 text-lg mb-8">
          We couldn't process your request. Please try again or choose a helpful option below.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-lg font-semibold bg-white text-gray-800 hover:bg-gray-100 transition"
          >
            Go Back
          </button>

          <Button
            label="Take Me Home"
            onClick={() => navigate("/")}
          />
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
