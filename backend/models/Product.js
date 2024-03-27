const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  stripe_product_id: { type: String, required: true },
  stripe_price_id: { type: String, required: true },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
