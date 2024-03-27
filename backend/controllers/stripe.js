const Product = require("../models/Product");
const SubscriptionRequest = require("../models/SubscriptionRequest");
const utils = require("../utils/utils");

const dotenv = require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_END_POINT_SECRET;

class StripeController {
  async createPaymentIntent(req, res, next) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 1000,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });
      return res.status(200).send({
        success: true,
        message: "Payment Intent has been created successfully.",
        result: {
          clientSecret: paymentIntent.client_secret,
        },
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: "Something is wrong.",
        errors: error,
      });
    }
  }
  async createProduct(req, res, next) {
    try {
      let producId;
      const product = await stripe.products.create({
        name: req.body.name,
        description: req.body.description,
      });
      if (!product) {
        return res.status(400).send("Product creation failed.");
      }
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: Number(req.body.price) * 100,
        currency: "usd",
      });
      if (!price) {
        return res.status(400).send("Price creation failed.");
      }
      producId = price.product;
      const productObj = new Product({
        title: req.body.name,
        description: req.body.description,
        stripe_product_id: producId,
        stripe_price_id: price.id,
      });
      await productObj.save();
      return res.status(200).send({
        success: true,
        message: "Product has been created successfully.",
        result: productObj,
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: "Something is wrong.",
        errors: error,
      });
    }
  }
  async getAllProduct(req, res, next) {
    try {
      const products = await Product.find({});
      return res.status(200).send({
        success: true,
        message: "Product has been fetched successfully.",
        result: products,
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: "Something is wrong.",
        errors: error,
      });
    }
  }
  async makeRequest(req, res, next) {
    try {
      const makeRequest = new SubscriptionRequest({
        username: req.body.username,
        email: req.body.email,
        productId: req.body.productId,
      });
      await makeRequest.save();
      return res.status(200).send({
        success: true,
        message: "Subscription request has been placed successfully.",
        result: makeRequest,
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: "Something is wrong.",
        errors: error,
      });
    }
  }

  async getAllRequest(req, res, next) {
    try {
      const subscriptionRequests = await SubscriptionRequest.find();
      // console.log("subReq",subscriptionRequests);
      const requestWithProducts = await Promise.all(
        subscriptionRequests.map(async (subscriptionRequest) => {
          const product = await Product.findById(subscriptionRequest.productId);
          // if (!product) {
          //   throw new Error(`Product not found for subscription request with ID ${subscriptionRequest._id}`);
          // }
          return { ...subscriptionRequest.toObject(), product };
        })
      );
      return res.status(200).send({
        success: true,
        message: "Get all request has been fetched successfully.",
        result: requestWithProducts,
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: "Something is wrong.",
        errors: error,
      });
    }
  }

  async approveRequest(req, res, next) {
    try {
      const requestId = req.params.id;
      const subReq = await SubscriptionRequest.findById(requestId).populate(
        "productId"
      );
      if (!subReq) {
        return res.status(400).send({
          success: false,
          message: "Bad Request",
          errors: {},
        });
      }
      const paymentLink = await stripe.paymentLinks.create({
        line_items: [
          {
            price: subReq.productId.stripe_price_id,
            quantity: 1,
          },
        ],
        metadata: {
          request_id: requestId,
        },
        after_completion: {
          type: "redirect",
          redirect: {
            url: "http://localhost:5173/subscription",
          },
        },
      });
      if (!paymentLink) {
        return res.status(400).send({
          success: false,
          message: "Bad Request",
          errors: {},
        });
      }
      subReq.stripe_link_id = paymentLink.id;
      subReq.is_request_approved = true;
      subReq.is_link_sent = true;
      await subReq.save();
      await utils.sendEmailForPaymentLink(subReq.email, paymentLink.url, res);
      return res.status(200).send({
        success: true,
        message: "Subscription request has been fetched successfully.",
        result: paymentLink,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Something is wrong.",
        errors: error,
      });
    }
  }

  async webHook(request, response) {
    const sig = request.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        break;
      case "checkout.session.completed":
        const requestId = event.data.object.metadata.request_id;
        if (!requestId) {
          console.log("Meta data not found");
        }
        const subReq = await SubscriptionRequest.findById(requestId);
        if (!subReq) {
          console.log("Subscription request not found.");
        }
        subReq.payment_status = true;
        await subReq.save();
        await stripe.paymentLinks.update(subReq.stripe_link_id, {
          active: false,
        });
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    // Send response
    response.status(200).send({
      success: true,
      message: "Event successfully",
    });
  }
}
module.exports = new StripeController();
