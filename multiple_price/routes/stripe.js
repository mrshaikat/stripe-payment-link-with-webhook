const express = require("express");
const StripeController = require("../controllers/stripe");
const bodyParser = require("body-parser");
const StripeUpdateController = require("../controllers/stripeUpdate");

const router = express.Router();

router.post("/payment-intent", StripeController.createPaymentIntent);
router.post("/product", StripeController.createProduct);
router.get("/product", StripeController.getAllProduct);
router.get("/get-all-request", StripeController.getAllRequest);
router.post("/make-request", StripeController.makeRequest);
router.put("/approve-request/:id", StripeController.approveRequest);
// router.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   StripeController.webHook
// );

// Update Subcription
router.post("/update-product", StripeUpdateController.createUpdateProduct);
router.post("/update-make-request", StripeUpdateController.makeRequest);
router.get("/update-get-all-request", StripeUpdateController.getAllRequest);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  StripeUpdateController.webHook
);
router.put("/update-approve-request/:id", StripeUpdateController.approveRequest);

module.exports = router;
