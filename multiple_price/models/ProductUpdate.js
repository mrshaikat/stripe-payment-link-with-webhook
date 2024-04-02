const mongoose = require("mongoose");

const productUpdateSchema = mongoose.Schema({
  icon: { type: String, required: true },
  ribbon: { type: String, required: true },
  title: { type: String, required: true },
  caption: { type: String, required: true },
  isPopular: { type: Boolean, default: false},
  description: { type: String, required: true },
  features_list: [
    {
      main_feature: { type: String, required: true },
      sub_title: [{ type: String, required: true }]
    }
  ],
  stripe_product_id: { type: String, required: true },
  prices: [
    {
      price: { type: Number, required: true },
      stripe_price_id: { type: String, required: true },
    },
  ],
});

const ProductUpdate = mongoose.model("ProductUpdate", productUpdateSchema);

module.exports = ProductUpdate;
