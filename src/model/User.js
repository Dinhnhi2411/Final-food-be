const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const userSchema = Schema(
  {
    name: 
    {
      type: String,
      required: true,
    },
    email: 
    {
      type: String,
      required: true,
      unique: true,
    },
    password: 
    {
      type: String,
      required: true,
    },

    avatarUrl: 
    {
      type: String,
      required: false,
      default: "",
    },
    storeName: 
    { type: String,
         required: false,
          default: "" 
        },
    logoUrl: 
    {
      type: String,
      required: false,
      default: "",
    },
    phone: 
    {
      type: Number,
      required: false,
    },
    address:
     {
      type: String,
      required: false,
      default: "",
    },
    city:
     {
      type: String,
      required: false,
      default: "",
    },
    country:
     {
      type: String,
      required: false,
      default: "",
    },
    company:
     {
      type: String,
      required: false,
      default: "",
    },
    comment:
    {
      type: String,
      required: false,
      default: "",
    },
    customer:
     {
      type: Boolean,
      default: false,
      select: false,
    },
    seller:
     {
      type: Boolean,
      default: false,
      select: false,
    },
    isDeleted:
     {
      type: Boolean,
      default: false,
      select: false,
      
    },
    productCount:
     {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const user = this._doc;
  delete user.password;
  delete user.isDeleted;
  return user;
};

userSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return accessToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
