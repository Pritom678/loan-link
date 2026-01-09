import { Link } from "react-router";

const Card = ({ loan }) => {
  const { _id, image, title, category, interest, limit } = loan;

  return (
    <div className="bg-white loan-card shadow-md rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow my-5">
      {/* Top Color Bar */}
      <div className="h-1 bg-primary"></div>

      {/* Image */}
      <figure className="h-40 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </figure>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h2 className="text-lg font-bold text-primary loan-card-title">
          {title}
        </h2>
        <p className="text-sm text-gray-700 loan-card-text">
          Category:{" "}
          <span className="font-medium text-secondary">{category}</span>
        </p>
        <p className="text-sm text-gray-700 loan-card-text">
          Interest:{" "}
          <span className="font-medium text-secondary">
            {typeof interest === "number" ? `${interest}%` : interest}
          </span>
        </p>
        <p className="text-sm text-gray-700 loan-card-text">
          Max Limit:{" "}
          <span className="font-medium text-secondary">
            ${limit.toLocaleString()}
          </span>
        </p>

        {/* Button */}
        <Link
          to={`/loans/${_id}`}
          className="inline-block mt-3 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-secondary transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default Card;
