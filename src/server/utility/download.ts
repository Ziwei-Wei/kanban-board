/*
 * express middleware to handle image/video downloading from client to app server
 * save the file to req.file or req.files
 * author: ziwei wei
 */
import multer from "multer";
import path from "path";

/**
 * download resume from client by multipart/form-data
 * @ size limit = 64 MB
 */
export const downloadResume = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./dist/resume");
    },
    filename: (req, file, cb) => {
      const {cardID} = req.params;
      console.log("here");
      cb(null, cardID.toString() + path.extname(file.originalname));
    }
  }),
  limits: {fileSize: 64e6}
}).single("resume");
