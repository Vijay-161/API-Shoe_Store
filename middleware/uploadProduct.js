const multer = require("multer");
const maxSize = 2 * 1024 * 1024; // 2MB
const path = require("path");

const storageProduct = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/products");
    },
    filename: (req, file, cb) => {
      let ext = path.extname(file.originalname);
      cb(null, `IMG-${Date.now()}` + ext);
    },
  });

  const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("File format not supported."), false);
    }
    cb(null, true);
  };

  const uploadProduct = multer({
    storage: storageProduct,
    fileFilter: imageFileFilter,
    limits: { fileSize: maxSize },
  }).single("profilePicture");

  module.exports = uploadProduct;