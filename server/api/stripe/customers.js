import Stripe from 'stripe';

// TODO: fake test stripe key (obviously)
const stripe = Stripe('sk_test_BQokikJOvBiI2HlWgH4olfQ2');

export default {
  create: function (params, callback) {
    stripe.customers.create({
      email: params.clientId,
      source: params.stripeToken
    }, callback);
  }
};
