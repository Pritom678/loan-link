import React, { useState, useRef } from "react";
import { FiX, FiCamera, FiUser, FiEdit3, FiSave } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";

const EditProfileModal = ({ isOpen, closeModal, onSave, userInfo }) => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    bio: "",
    profilePicture: user?.photoURL || "",
  });

  const [previewImage, setPreviewImage] = useState(user?.photoURL || "");
  const [isLoading, setIsLoading] = useState(false);

  // Update form data when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        displayName: user?.displayName || "",
        bio: userInfo?.bio || "",
        profilePicture: user?.photoURL || "",
      });
      setPreviewImage(user?.photoURL || "");
    }
  }, [isOpen, user, userInfo]);

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
        setFormData((prev) => ({
          ...prev,
          profilePicture: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const displayName = formData.displayName.trim();
    if (!displayName) {
      alert("Display name is required");
      return;
    }

    if (displayName.length < 2 || displayName.length > 50) {
      alert("Display name must be between 2 and 50 characters");
      return;
    }

    if (formData.bio.length > 500) {
      alert("Bio cannot exceed 500 characters");
      return;
    }

    setIsLoading(true);

    try {
      // Prepare clean data
      const cleanData = {
        displayName: displayName,
        bio: formData.bio.trim(),
        profilePicture: formData.profilePicture || "",
      };

      await onSave(cleanData);
      closeModal();
    } catch (error) {
      console.error("Error saving profile:", error);
      // Error handling is done in the parent component
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form data when closing
    setFormData({
      displayName: user?.displayName || "",
      bio: userInfo?.bio || "",
      profilePicture: user?.photoURL || "",
    });
    setPreviewImage(user?.photoURL || "");
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary/10 rounded-lg mr-3">
              <FiEdit3 className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Edit Profile
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Section */}
          <div className="text-center">
            <div className="relative inline-block">
              <img
                src={
                  previewImage ||
                  `https://ui-avatars.com/api/?name=${
                    formData.displayName || "User"
                  }&background=9c6c1e&color=fff&size=120`
                }
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                <FiCamera className="w-4 h-4" />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <p className="mt-2 text-sm text-gray-500">
              Click the camera icon to change your profile picture
            </p>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiUser className="w-4 h-4 inline mr-2" />
              Display Name
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  displayName: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              placeholder="Enter your display name"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiEdit3 className="w-4 h-4 inline mr-2" />
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  bio: e.target.value,
                }))
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
              placeholder="Tell us about yourself..."
              maxLength={500}
            />
            <p className="mt-1 text-xs text-gray-500 character-counter">
              {formData.bio.length}/500 characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
