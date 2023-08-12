const Product = require('../models/product')
const asyncHandler = require("../middleware/async");
exports.getProducts = async (req, res, next) => {
    try {
      const products = await Product.find();
  
      res.status(200).json({
        success: true,
        count: products.length,
        data: products,
      });
    } catch (err) {
      res.status(400).json({ success: false });
    }
  };

  exports.createProduct = async (req, res, next) => {
    try {
      const product = await Product.create(req.body);
  
      res.status(201).json({
        success: true,
        data: product,
      });
    } catch (err) {
      next(err);
    }
  };

  exports.uploadProductImage = asyncHandler(async (req, res, next) => {
    
  
    if (!req.file) {
      return res.status(400).send({ message: "Please upload a file" });
    }
    res.status(200).json({
      success: true,
      data: req.file.filename,
    });
  });

  exports.getProduct= async(req,res,next) =>{
    try {
      const product = await Product.findById(req.params.id);
  
      if (!product) {
        return res.status(401).json({ message: "cannot find the Product " });
      }
  
      res.status(200).json({ success: true, data: product });
    } catch (err) {
      next(err);
    }    
  }

  exports.deleteProduct = asyncHandler(async (req, res, next) => {
    await Product.findByIdAndDelete(req.params.id).then((product) => {
      if (!product) {
        return res
          .status(404)
          .json({ message: "Product not found with id of ${req.params.id}" });
      }
      res.status(200).json({ success: true, data: product });
    });
  });

  exports.updateProduct = async (req, res, next) => {
    try {
      let product = await Product.findById(req.params.id);
      if (!product) {
        return res
          .status(404)
          .json({ message: "Product not found with id of ${req.params.id}" });
      }
  
      product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
  
      res.status(200).json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  };

  exports.getProductByCategory= async(req,res,next) =>{
    try {
      const product = await Product.find({category:req.body.category});
      if (!product) {
        return res.status(401).json({ message: "cannot find the Product " });
      }
      res.status(200).json({ success: true, data: product });
    } catch (err) {
      next(err);
    }    
  }