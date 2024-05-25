import dotenv from "dotenv";

const envIsPresent = dotenv.config();

if (!envIsPresent) {
  throw new Error(
    "No .env file found for this project, please add a .env file"
  );
}

const globalConfig = {
  port: process.env.PORT,
  mongodb: {
    mongoUri: process.env.MONGO_URI,
    mongoUriDev: process.env.MONGO_URI_DEV
  },
  nodemailer: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtLifetime: process.env.JWT_LIFETIME,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  stripe: {
    testApiKey: process.env.STRIPE_TEST_API_KEY,
  },
};

export default globalConfig;
