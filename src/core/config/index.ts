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
  },
  nodemailer: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
  },
};

export default globalConfig;
