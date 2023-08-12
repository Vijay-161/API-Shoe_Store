const express = require("express");
const router = express.Router();

const {createOrder, getOrders, deleteOrder,getOrder } = require("../controllers/order")
router.post("/createOrder", createOrder);
router.get("/getAllOrder", getOrders);
router.get("/user", getOrder);
router.delete("/:id", deleteOrder);
// router.put("/:id", updateCart);
// router.get("/:id", getCartById)


module.exports = router