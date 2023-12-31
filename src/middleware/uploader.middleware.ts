import multer from "multer";
import { FileFilterCallback } from "multer";
import * as CustomError from "../errors";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const scriptFileExtensions = [
    "js",
    "ts",
    "php",
    "py",
    "rb",
    "sh",
    "bat",
    "exe",
  ];
  const fileExtension = file.originalname.split(".").pop();
  if (!fileExtension || scriptFileExtensions.includes(fileExtension)) {
    cb(
      new CustomError.BadRequestError(
        "The file you are trying to upload seems malicious and has been blocked. Please contact support if you think this is a mistake."
      )
    );
  }
  cb(null, true);
};

const uploader = multer({ storage, fileFilter });

export default uploader;
