import Stripe from 'stripe';

// TODO: fake test stripe key (obviously)
const stripe = Stripe('sk_test_BQokikJOvBiI2HlWgH4olfQ2');

export default {
  create_customer: function (params, callback) {
    stripe.customers.create(params, callback);
  },

  create_charge: function(params, callback) {
    stripe.charges.create(params, callback);
  }
};
