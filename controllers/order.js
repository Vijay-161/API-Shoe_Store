const Order = require('../models/order')
const asyncHandler = require("../middleware/async");

exports.createOrder = async (req, res, next) => {
    try {
      const order = await Order.create(req.body);
  
      res.status(201).json({
        success: true,
        data: order,
      });
    } catch (err) {
      next(err);
    }
  };


  exports.getOrder = async (req, res, next) => {
    try {
      const orders = await Order.find({user: req.body.user});
  
      res.status(200).json({
        success: true,
        count: orders.length,
        data: orders,
      });
    } catch (err) {
      res.status(400).json({ success: false });
    }
  };

  exports.deleteOrder = async (req, res, next) => {
    await Order.findByIdAndDelete(req.params.id).then((order) => {
      if (!order) {
        return res
          .status(404)
          .json({ message: "Order not found with id of ${req.params.id}" });
      }
      res.status(200).json({ success: true, data: order });
    });
  };

  exports.getOrders = async (req, res, next) => {
    try {
      const orders = await Order.find();
  
      res.status(200).json({
        success: true,
        count: orders.length,
        data: orders,
      });
    } catch (err) {
      res.status(400).json({ success: false });
    }
  };