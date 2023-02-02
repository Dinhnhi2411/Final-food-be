const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = Schema(
    {
        productName: {
            type:String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        types: {
            type: String,
            enum: ["Fruit", "Vegetable"],
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        priceSale: {
            type: Number,
            required: false,
        },
        discount: {
            type: Number,
             default: 0 
            },
        unit: {
            type: String,
            required: true,
        },
        image: {
            type: [],
            required: true,
        },
        rating: {
            type: Number,
            required: false,
        },
        // feedback: {
        //     type: Schema.Types.ObjectId,
        //     required: true,
        //     ref: "Review", 

        // },
        status: {
            type: String,
            enum: ["Normal", "Discount", "New", "Top"],
           
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
            required: true
        },
        author: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User", 
        },

    },
    { timestamps: true } //CreatedAt & UpdatedAt
);

productSchema.pre("save", function (next) {
    let product = this;

    if (product.isModified("discount") || product.isModified("price")){
        product.priceSale = parseFloat(
            (product.price - (product.discount * product.price) / 100).toFixed(1)
        );
    }
        next();

});


const Product = mongoose.model("Product", productSchema);
module.exports = Product;