import React from 'react';
import ReactDOM from 'react-dom';
import expect from 'expect';
import {createRenderer, renderIntoDocument} from 'react-addons-test-utils';
import Html from '../../src/helpers/html.js';

describe('html component', () => {

  it('should be an html block', () => {
    const html = <html />;
    expect(html.type).toEqual('html');
    expect(html.props).toEqual({});
  })
});
