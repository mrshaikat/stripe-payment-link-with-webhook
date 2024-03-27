const mongoose = require("mongoose");

const subReqSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  productId: { type: mongoose.Types.ObjectId, required: true, ref: "Product" },
  is_request_approved: { type: Boolean, default: false },
  payment_status: { type: Boolean, default: false },
  is_link_sent: { type: Boolean, default: false },
  stripe_link_id: { type: String, default: null },
});

const SubscriptionRequest = mongoose.model("SubscriptionRequest", subReqSchema);

module.exports = SubscriptionRequest;
