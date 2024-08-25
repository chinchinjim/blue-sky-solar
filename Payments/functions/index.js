/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
require("dotenv").config();
// const {log} = require("firebase-functions/logger");
const {onCall} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// const { defineSecret } = require('firebase-functions/params');

const stripe = require("stripe")(process.env.STRIPE_SECRET);

// exports.create_payment_intent = onCall(async (data, context) => {
//     const { panels } = data
//   });

exports.new_payment_intent = onCall({cors: "*"},
    async (req) => {
      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 10000,
        currency: "cad",
        // In the latest version of the API, specifying the
        // `automatic_payment_methods` parameter is optional
        // because Stripe enables its functionality by default.
        automatic_payment_methods: {
          enabled: true,
        },
      });
      // res.send({clientSecret: paymentIntent.client_secret});
      return {clientSecret: paymentIntent.client_secret};
    });

// exports.create_payment_intent = onRequest({cors: "*"},
//     async (req, res) => {
//       // Create a PaymentIntent with the order amount and currency
//       const paymentIntent = await stripe.paymentIntents.create({
//         amount: 10000,
//         currency: "cad",
//         // In the latest version of the API, specifying the
//         // `automatic_payment_methods` parameter is optional
//         // because Stripe enables its functionality by default.
//         automatic_payment_methods: {
//           enabled: true,
//         },
//       });
//       res.send({clientSecret: paymentIntent.client_secret});
//     });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
