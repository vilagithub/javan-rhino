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
  form: {
    marginBottom: '10px'
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
  },
  info: {
    borderLeft: '3px solid #AAA',
    paddingLeft: '10px',
    marginBottom: '5px'
  }
};

export default React.createClass({
  getInitialState() {
    return {
      isLoading: false,
      isError: false,
      message: '',
      customer: null,
      source: null,
      sourceToken: null,
      purchases: []
    };
  },

  saveCard(event) {
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
          message: <span>Thank you for registering your card for payment.</span>,
          source: response.card,
          sourceToken: response.id
        });
      }
    });
  },

  saveCustomer() {
    this.post('/api/stripe/customers', `source=${this.state.sourceToken}&email=tester@example.com`, (responseText) => {
      var response = JSON.parse(responseText);
      window.console.log('/api/customers', response);

      this.setState({
        customer: response
      });

    });
  },

  purchaseWithCard(event) {
    window.console.log(`Purchase with card (token) for ${event.target.dataset.amount} cents`);

    this.post('/api/stripe/charges', `source=${this.state.sourceToken}&amount=${event.target.dataset.amount}&currency=usd&description=test`, this.onPurchase);
  },

  purchaseWithCustomer(event) {
    window.console.log(`Purchase with customer for ${event.target.dataset.amount} cents`);

    this.post('/api/stripe/charges', `customer=${this.state.customer.id}&amount=${event.target.dataset.amount}&currency=usd&description=test`, this.onPurchase);
  },

  onPurchase(responseText) {
    var purchase = JSON.parse(responseText);
    window.console.log('/api/charges', purchase);

    this.setState({
      purchases: this.state.purchases.concat([purchase])
    });
  },

  resetToken() {
    this.setState({
      source: null,
      sourceToken: null
    });
  },

  post(url, params, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 500)) {
        callback(xhr.responseText);
      }
    };
    xhr.send(params);
  },

  render() {
    let content = [];

    if (!this.state.source) {
      content.push(
        <form key="form" style={style.form} action="" method="POST" id="payment-form" onSubmit={this.saveCard}>
          <div style={style.formRow}>
            <label>
              <div>Card Number</div>
              <input type="text" size="20" data-stripe="number" defaultValue="4012888888881881"/>
            </label>
          </div>

          <div style={style.formRow}>
            <label>
              <div>Expiration (MM/YY)</div>
              <input type="text" size="2" data-stripe="exp_month" defaultValue="12"/>
            </label>
            <span> / </span>
            <input type="text" size="2" data-stripe="exp_year" defaultValue="21"/>
          </div>

          <div style={style.formRow}>
            <label>
              <div>CVC</div>
              <input type="text" size="4" data-stripe="cvc" defaultValue="123"/>
            </label>
          </div>

          <input type="submit" className="submit"
            value={this.state.isLoading ? 'Loading...' : 'Add payment details'}
            disabled={this.state.isLoading ? 'disabled' : ''}/>
        </form>
      );
    }

    if (this.state.sourceToken) {
      content.push(
        <div key="form-message" style={ this.state.isError ? style.error : style.success }>
          {this.state.message}
        </div>
      );
    }

    if (this.state.source) {
      content.push(
        <div key="card-info" style={ style.info }>
          Card: <b>**** **** **** {this.state.source.last4}</b><br/>
          Expiration date: <b>{this.state.source.exp_month}/{this.state.source.exp_year}</b><br/>
        </div>
      );
    }

    if (this.state.sourceToken) {
      content.push(
        <div key="token-info" style={ style.info }>
          <em>Stripe token: <b>{this.state.sourceToken}</b></em><br/>
          <button onClick={this.saveCustomer}>Save card to customer using token</button><br/>
          <button onClick={this.purchaseWithCard} data-amount="1337">Purchase $13.37 with card token</button><br/>
          <button onClick={this.purchaseWithCard} data-amount="4321">Purchase $43.21 with card token</button><br/>
          <button onClick={this.resetToken}>Reset token</button><br/>
        </div>
      );
    }

    if (this.state.customer) {
      if (this.state.customer.id) {
        content.push(
          <div key="customer-info" style={ style.info }>
            Customer ID: <em>{this.state.customer.id}</em><br/>
            Email: <b>{this.state.customer.email}</b><br/>
            <button onClick={this.purchaseWithCustomer} data-amount="1337">Purchase $13.37 with customer</button><br/>
            <button onClick={this.purchaseWithCustomer} data-amount="4321">Purchase $43.21 with customer</button><br/>
            <button onClick={this.resetToken}>Reset token</button><br/>
          </div>
        );
      }
      else {
        content.push(
          <div key="customer-info" style={ style.error }>
            { this.state.customer.message }
          </div>
        );
      }
    }

    if (this.state.purchases.length) {
      this.state.purchases.forEach((purchase, i) => {
        if (purchase.id) {
          content.push(
            <div key={ `purchase-info-${i}` } style={ style.info }>
              Purchase for { purchase.amount } for { purchase.description }
            </div>
          );
        }
        else {
          content.push(
            <div key={ `purchase-info-${i}` } style={ style.error }>
              { purchase.message }
            </div>
          );
        }
      });
    }

    return <div style={style.paymentForm}>
      {content}
    </div>;
  }
});
