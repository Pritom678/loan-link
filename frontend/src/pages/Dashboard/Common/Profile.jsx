import useAuth from "../../../hooks/useAuth";
import coverImg from "../../../assets/images/cover.jpg";
import { FaEdit, FaSignOutAlt } from "react-icons/fa";

const Profile = () => {
  const { user, logOut } = useAuth();

  return (
    <div className="min-h-screen flex justify-center items-center bg-base-200 px-4">
      <div className="bg-white/90 shadow-xl rounded-2xl overflow-hidden w-full max-w-3xl">
        {/* Header Cover */}
        <div className="relative">
          <img
            src={coverImg}
            alt="cover photo"
            className="w-full h-48 object-cover"
          />
          {/* Profile Avatar */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            <img
              src={user?.photoURL}
              alt="profile"
              className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
            />
          </div>
        </div>

        <div className="pt-16 pb-6 px-6 text-center">
          {/* User Name */}
          <h2 className="text-2xl font-semibold text-gray-800">
            {user?.displayName || "Unknown"}
          </h2>
          <p className="text-sm text-gray-500">{user?.email}</p>

          {/* Role Tag */}
          <div className="mt-2 inline-block bg-primary/20 text-primary px-4 py-1 rounded-full text-xs font-semibold">
            Borrower
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-base-100 py-3 rounded-lg shadow-sm">
              <p className="text-lg font-bold text-primary">05</p>
              <p className="text-xs text-gray-500">Loans Applied</p>
            </div>

            <div className="bg-base-100 py-3 rounded-lg shadow-sm">
              <p className="text-lg font-bold text-green-600">03</p>
              <p className="text-xs text-gray-500">Approved Loans</p>
            </div>

            <div className="bg-base-100 py-3 rounded-lg shadow-sm">
              <p className="text-lg font-bold text-yellow-600">02</p>
              <p className="text-xs text-gray-500">Pending Loans</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-center mt-6">
            <button className="btn btn-primary btn-sm gap-2">
              <FaEdit /> Edit Profile
            </button>
            <button className="btn btn-secondary btn-sm gap-2" onClick={logOut}>
              <FaSignOutAlt /> Log Out
            </button>
          </div>

          {/* ID */}
          <p className="text-xs text-gray-500 mt-4">User ID: {user?.uid}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
