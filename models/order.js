const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    },
    product: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Product'
    },
    name: {
        type: String,
    },
    image: {
        type: String,
    },
    price: {
        type: Number,
    },
    quantity: {
        type: Number,
        default: 1,
        max: 10,
        min: 1,
    },
    username: {
        type: String,
    },
    payment: {
        type: Boolean,
    }

})

module.exports = mongoose.model("Order", orderSchema)