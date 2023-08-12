const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productImage: {
        type: String,
        default: null
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        default: null
    },
    desc: {
        type: String,
        default: 'Good product'
    }
})
module.exports = mongoose.model("Product", productSchema)