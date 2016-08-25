import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom/server';
import Helmet from 'react-helmet';

export default class Html extends Component {
  render() {
    const { assets, component } = this.props;
    const content = component ? ReactDOM.renderToString(component) : '';
    const head = Helmet.rewind();
    const attrs = head.htmlAttributes.toComponent();

    return (
      <html {...attrs}>
        <head>
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {head.link.toComponent()}
          <link rel="stylesheet" href={ assets.styles.main } />
        </head>
        <body>
          <div id="content" dangerouslySetInnerHTML={{ __html: content }}/>
          <script src={ assets.javascript.main } charSet="UTF-8"/>
        </body>
      </html>
    );
  }
}

Html.propTypes = {
  component: PropTypes.node,
  assets: React.PropTypes.shape({
    styles: React.PropTypes.shape({
      main: React.PropTypes.string.isRequired
    }),
    javascript: React.PropTypes.shape({
      main: React.PropTypes.string.isRequired
    })
  })
};
