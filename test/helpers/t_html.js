import React from 'react';
import expect from 'expect';
import { render, shallow } from 'enzyme';
import Helmet from 'react-helmet';

import Html from '../../src/helpers/html.js';

// NOTE:
// due to a bug in react-helmet [1] React throws a warning while running tests
// without Helmet passed to Html helper:
//
//    Warning: React.createElement(...): Expected props argument to be a plain object.
//    Properties defined in its prototype chain will be ignored.
//
// [1] https://github.com/nfl/react-helmet/issues/158
describe('<Html /> helper', () => {
  const assets = {
    styles: {
      main: 'example.css'
    },
    javascript: {
      main: 'example.js'
    }
  };

  it('should be an html block', () => {
    const html = shallow(<Html assets={ assets } />);

    expect(html.type()).toEqual('html');
  });

  it('should render content given as prop', () => {
    const content = <span>test</span>;
    // because of dangerouslySetInnerHTML we need to do static render instead of shallow
    const html = render(<Html component={ content } assets={ assets } />);

    expect(html.find('#content').children('span').length).toEqual(1);
    expect(html.find('#content').text()).toEqual('test');
  });

  it('should render stylesheet links in head', () => {
    const content = <span>test</span>;
    const html = shallow(<Html component={ content } assets={ assets } />);

    expect(html.find('body link[rel="stylesheet"]').length).toEqual(0);
    expect(html.find('head link[rel="stylesheet"]').length).toEqual(1);
  });

  it('should render title from Helmet', () => {
    const helmet = <Helmet title='test title' />;
    const html = shallow(<Html component={ helmet } assets={ assets } />);

    expect(html.find('title').text()).toEqual('test title');
  });
});
