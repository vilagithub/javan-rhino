/* global Stripe */

import React from 'react';

const style = {
  paymentForm: {
    background: 'white',
    padding: '10px',
    width: '400px',
    margin: 'auto',
    borderRadius: '5px'
  },
  formRow: {
    marginBottom: '5px'
  },
  error: {
    borderLeft: '3px solid red',
    paddingLeft: '10px',
    color: 'red',
    marginBottom: '5px'
  },
  success: {
    borderLeft: '3px solid green',
    paddingLeft: '10px',
    marginBottom: '5px'
  }
};

export default React.createClass({
  getInitialState() {
    return {
      isLoading: false,
      isError: false,
      message: ''
    };
  },

  onSubmit(event) {
    event.preventDefault();

    // TODO: only do it once (and only on client)
    // TODO: and of course this is just a demo test key, not the real one
    Stripe.setPublishableKey('pk_test_6pRNASCoBOKtIshFeQd4XMUh');

    this.setState({ isLoading: true });

    // Request a token from Stripe:
    Stripe.card.createToken(event.target, (status, response) => {
      window.console.log(status, response);

      this.setState({ isLoading: false });
      if (response.error) {
        this.setState({
          isError: true,
          message: response.error.message
        });
      }
      else {
        this.setState({
          isError: false,
          message: <span>
            Thank you for registering your card for payment.<br/>
            Card: <b>**** **** **** {response.card.last4}</b><br/>
            Expiration date: <b>{response.card.exp_month}/{response.card.exp_year}</b><br/>
            <em>Stripe token: <b>{response.id}</b></em><br/>
            Goto console and complete your payment with<br/>
            <code>snap buy &lt;snap-name&gt;</code>
          </span>
        });
      }
    });
  },

  render() {
    return <div style={style.paymentForm}>

      <form action="" method="POST" id="payment-form" onSubmit={this.onSubmit}>
        <div style={ this.state.isError ? style.error : style.success }>
          {this.state.message}
        </div>

        <div style={style.formRow}>
          <label>
            <div>Card Number</div>
            <input type="text" size="20" data-stripe="number" />
          </label>
        </div>

        <div style={style.formRow}>
          <label>
            <div>Expiration (MM/YY)</div>
            <input type="text" size="2" data-stripe="exp_month" />
          </label>
          <span> / </span>
          <input type="text" size="2" data-stripe="exp_year" />
        </div>

        <div style={style.formRow}>
          <label>
            <div>CVC</div>
            <input type="text" size="4" data-stripe="cvc" />
          </label>
        </div>

        <input type="submit" className="submit"
          value={this.state.isLoading ? 'Loading...' : 'Add payment details'}
          disabled={this.state.isLoading ? 'disabled' : ''}/>
      </form>
    </div>;
  }
});
