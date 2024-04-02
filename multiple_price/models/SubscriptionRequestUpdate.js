const mongoose = require("mongoose");

const subReqUpdateSchema = new mongoose.Schema({
  productId: { type: mongoose.Types.ObjectId, required: true, ref: "ProductUpdate" },
  userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  price: { type: Number },
  is_request_approved: { type: Boolean, default: false },
  payment_status: { type: Boolean, default: false },
  is_link_sent: { type: Boolean, default: false },
  stripe_link_id: { type: String, default: null },
});

const SubscriptionUpdateRequest = mongoose.model("SubscriptionUpdateRequest", subReqUpdateSchema);

module.exports = SubscriptionUpdateRequest;
