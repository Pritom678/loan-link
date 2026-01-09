import axios from "axios";

export const imageUpload = async (imageData) => {
  try {
    const formData = new FormData();
    formData.append("image", imageData);

    const { data } = await axios.post(
      `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_IMGBB_API_KEY
      }`,
      formData
    );
    return data?.data?.display_url;
  } catch (error) {
    console.error(
      "ImgBB upload failed:",
      error.response?.data || error.message
    );

    // If ImgBB fails, return a default placeholder image
    // You can replace this with any default avatar URL
    return "https://i.ibb.co/tMkbc0pX/business-user-shield-78370-7029.avif";
  }
};

//save or update user in db
export const saveOrUpdateUser = async (userData) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL}/user`,
    userData
  );

  return data;
};
