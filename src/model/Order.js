const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = Schema(
    {
    name: {
        type: String, 
        required: true,
    },
    addressShip: {
        type: String, 
        required: true,
    },
    phone: 
    {
        type: Number,
        required: true,
    },
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Product",
        },
        amount: {
            type: Number,
            required: true,
        },
        sum: {
            type: Number, 
            required: true,
        },
        createAt: { type: Date},
        updatedAt: { type: Date },

    }],
    priceShip: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    status: {
        type: String,
        enum: [
            "Preparing Order",
            "Order is shipping",
            "Delivered",
            "Cancel"

        ],
        default: "Preparing Order",
        required: true,
    },
    isDeleted: {
        type: Boolean, 
        default: false,
        select: false,
    },

    }, 
    { timestamps: true }
);



const Order = mongoose.model("Order", orderSchema);
module.exports = Order;