const env = import.meta.env;

const cloudKey = env.VITE_CLOUDINARY_API_KEY;
const cloudName = env.VITE_CLOUDINARY_NAME;
const uploadUrl = "https://api.cloudinary.com/v1_1/" + cloudName + "/auto/upload";

export {uploadUrl,cloudKey ,cloudName }