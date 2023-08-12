const express = require("express");
const router = express.Router();

const {createCart, getCarts, getCart, deleteCart, updateCart, getCartById} = require("../controllers/cart")
router.post("/createCart", createCart);
router.get("/getAllCart", getCarts);
router.get("/user", getCart);
router.delete("/:id", deleteCart);
router.put("/:id", updateCart);
router.get("/:id", getCartById)


module.exports = router