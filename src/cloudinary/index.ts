import { v2 as cloudinary, ConfigOptions } from 'cloudinary';
const { CloudinaryStorage } = require('multer-storage-cloudinary');//using require here or else flder gets screwed up

// Configure Cloudinary
const cloudinaryConfig: ConfigOptions = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
};
cloudinary.config(cloudinaryConfig);

// Set up Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp',
        allowedFormats: ['jpg', 'jpeg', 'png']
    }
});

export { cloudinary, storage };
