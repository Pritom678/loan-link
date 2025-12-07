import { Link } from "react-router";

const Card = ({ loan }) => {
  const { image, title, category, interest, maxLimit } = loan;

  return (
    <div className="bg-base-100 shadow-md rounded-xl overflow-hidden border border-base-300 hover:shadow-lg transition-shadow my-5">
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
        <h2 className="text-lg font-bold text-primary">{title}</h2>
        <p className="text-sm text-neutral-700">
          Category:{" "}
          <span className="font-medium text-secondary">{category}</span>
        </p>
        <p className="text-sm text-neutral-700">
          Interest:{" "}
          <span className="font-medium text-secondary">{interest}</span>
        </p>
        <p className="text-sm text-neutral-700">
          Max Limit:{" "}
          <span className="font-medium text-secondary">
            ${maxLimit.toLocaleString()}
          </span>
        </p>

        {/* Button */}
        <Link
          to={`/loans/${title.toLowerCase().replace(/\s+/g, "-")}`}
          className="inline-block mt-3 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-secondary transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default Card;
