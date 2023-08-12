const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const uploadProduct = require("../middleware/uploadProduct")

const {createProduct, getProducts, uploadProductImage, getProduct, deleteProduct, updateProduct, getProductByCategory} = require("../controllers/product")

router.get("/getAllProduct", getProducts);
router.get("/:id", getProduct);

router.post("/uploadProductImage", uploadProduct, uploadProductImage);
router.post("/createProduct", createProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);
router.post("/getByCategory", getProductByCategory);

module.exports = router