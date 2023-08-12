const Cart = require('../models/cart')
const asyncHandler = require("../middleware/async");

exports.getCarts = async (req, res, next) => {
    try {
      const carts = await Cart.find();
  
      res.status(200).json({
        success: true,
        count: carts.length,
        data: carts,
      });
    } catch (err) {
      res.status(400).json({ success: false });
    }
  };

  exports.createCart = async (req, res, next) => {
    try {
      const cart = await Cart.create(req.body);
  
      res.status(201).json({
        success: true,
        data: cart,
      });
    } catch (err) {
      next(err);
    }
  };

  exports.getCart = async (req, res, next) => {
    try {
      const carts = await Cart.find({user: req.body.user});
  
      res.status(200).json({
        success: true,
        count: carts.length,
        data: carts,
      });
    } catch (err) {
      res.status(400).json({ success: false });
    }
  };

  exports.deleteCart = async (req, res, next) => {
    await Cart.findByIdAndDelete(req.params.id).then((cart) => {
      if (!cart) {
        return res
          .status(404)
          .json({ message: "Cart not found with id of ${req.params.id}" });
      }
      res.status(200).json({ success: true, data: cart });
    });
  };

  exports.updateCart = async (req, res, next) => {
    try {
      let cart = await Cart.findById(req.params.id);
      if (!cart) {
        return res
          .status(404)
          .json({ message: "Cart not found with id of ${req.params.id}" });
      }
  
      cart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
  
      res.status(200).json({ success: true, data: cart });
    } catch (err) {
      next(err);
    }
  };

  exports.getCartById= async(req,res,next) =>{
    try {
      const cart = await Cart.findById(req.params.id);
  
      if (!cart) {
        return res.status(401).json({ message: "cannot find the Cart " });
      }
  
      res.status(200).json({ success: true, data: cart });
    } catch (err) {
      next(err);
    }    
  }