const express = require("express");
const StripeController = require("../controllers/stripe");
const bodyParser = require("body-parser");

const router = express.Router();

router.post("/payment-intent", StripeController.createPaymentIntent);
router.post("/product", StripeController.createProduct);
router.get("/product", StripeController.getAllProduct);
router.get("/get-all-request", StripeController.getAllRequest);
router.post("/make-request", StripeController.makeRequest);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  StripeController.webHook
);
router.put("/approve-request/:id", StripeController.approveRequest);

module.exports = router;
