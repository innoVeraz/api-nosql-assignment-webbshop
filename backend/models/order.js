const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: String,
  products: [{ productId: String, quantity: Number }],
});

module.exports = mongoose.model("Orders", orderSchema);
