const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
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
    }
})

module.exports = mongoose.model("Cart", cartSchema)