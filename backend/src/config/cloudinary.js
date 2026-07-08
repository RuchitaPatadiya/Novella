import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary if credentials are present
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log("Cloudinary Media Service Configured.");
} else {
  console.log("Cloudinary credentials missing. Falling back to local storage.");
}

export { cloudinary, isCloudinaryConfigured };
