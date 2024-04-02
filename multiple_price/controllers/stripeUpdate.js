const Product = require("../models/Product");
const ProductUpdate = require("../models/ProductUpdate");
const SubscriptionRequest = require("../models/SubscriptionRequest");
const SubscriptionUpdateRequest = require("../models/SubscriptionRequestUpdate");
const User = require("../models/User");
const utils = require("../utils/utils");

const dotenv = require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_END_POINT_SECRET;

class StripeUpdateController {
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
      // const price = await stripe.prices.create({
      //   product: product.id,
      //   unit_amount: Number(req.body.price) * 100,
      //   currency: "usd",
      // });
      // if (!price) {
      //   return res.status(400).send("Price creation failed.");
      // }
      // producId = price.product;
      const productObj = new Product({
        title: req.body.name,
        description: req.body.description,
        stripe_product_id: product.id,
        // stripe_price_id: price.id,
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

  // Make Request For AI
  async makeRequest(req, res, next) {
    try {
      const user = new User({
        username: req.body.username,
        email: req.body.email,
      });
      await user.save();
      const userId = user._id;

      const makeRequest = new SubscriptionUpdateRequest({
        userId: userId,
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
      const subscriptionRequests = await SubscriptionUpdateRequest.find();

const requestWithProductsAndUsers = await Promise.all(
  subscriptionRequests.map(async (subscriptionRequest) => {
    const populatedRequest = await SubscriptionUpdateRequest.findById(subscriptionRequest._id)
      .populate('productId')
      .populate('userId'); 
    return populatedRequest;
  })
);
      return res.status(200).send({
        success: true,
        message: "Get all request has been fetched successfully.",
        result: requestWithProductsAndUsers,
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
      const { productId, price, content } = req.body;
      console.log(req.body);
      let priceForLinkCreation;
      const subReq = await SubscriptionUpdateRequest.findById(requestId)
  const userAndProductData = await SubscriptionUpdateRequest.findById(requestId)
  .populate('productId')
  .populate('userId');

      console.log("subReq", subReq);
      if (!subReq) {
        return res.status(400).send({
          success: false,
          message: "Bad Request",
          errors: {},
        });
      }
      if (productId.toString() !== subReq.productId.toString()) {
        subReq.productId = productId;
        await subReq.save();
      }
      const product = await ProductUpdate.findById(productId);
      if (!product) {
        return res.status(400).send({
          success: false,
          message: "Bad Request - Product not found.",
          errors: {},
        });
      }
      const isPriceExistInProduct = product.prices.find(
        (item) => Number(item.price) === Number(price)
      );
      if (!isPriceExistInProduct) {
        const stripePrice = await stripe.prices.create({
          product: product.stripe_product_id,
          unit_amount: Number(price) * 100,
          currency: "usd",
        });
        if (!stripePrice) {
          return res.status(400).send("Price creation failed.");
        }
        product.prices.push({
          price: price,
          stripe_price_id: stripePrice.id,
        });
        await product.save();
        priceForLinkCreation = stripePrice.id;
      } else {
        priceForLinkCreation = isPriceExistInProduct.stripe_price_id;
      }

      const paymentLink = await stripe.paymentLinks.create({
        line_items: [
          {
            price: priceForLinkCreation,
            quantity: 1,
          },
        ],
        metadata: {
          request_id: requestId,
        },
        after_completion: {
          type: "redirect",
          redirect: {
            url: "http://localhost:3000/subscription",
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
      subReq.price = price;
      subReq.stripe_link_id = paymentLink.id;
      subReq.is_request_approved = true;
      subReq.is_link_sent = true;
      await subReq.save();
      await utils.sendEmailForPaymentLink(
        userAndProductData.userId.email,
        paymentLink.url,
        content,
        res
      );
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

  // Create Product For AI
  async createUpdateProduct(req, res, next) {
    try {

      const product = await stripe.products.create({
        name: req.body.title,
        description: req.body.description,
        // metadata: {
        //   features_list: req.body.features_list
        // }
      });
      if (!product) {
        return res.status(400).send("Product creation failed.");
      }
      const productObj = new ProductUpdate({
        ...req.body,
        stripe_product_id: product.id
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
}
module.exports = new StripeUpdateController();
