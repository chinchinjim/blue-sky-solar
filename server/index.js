/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
require("dotenv").config();
const {log} = require("firebase-functions/logger");
const admin = require("firebase-admin");
const {onCall, HttpsError} = require("firebase-functions/v2/https");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

admin.initializeApp();


// const logger = require("firebase-functions/logger");

// const { defineSecret } = require('firebase-functions/params');


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

exports.adopt_cell = onCall({cors: "*"},
    async (req) => {
      // console.log(req.data);

      const ref = admin.database().ref("/cells");
      const snapshot = await ref
          .orderByChild("cell").equalTo(req.data.cell).once("value");

      if (snapshot.exists()) {
        log(snapshot.val());
        throw new HttpsError("already-exists", "Cell already exists");
      }
      return admin.database().ref("/cells").push(req.data).then(() => {
        // Returning the sanitized message to the client.
        return "Success";
      });
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
