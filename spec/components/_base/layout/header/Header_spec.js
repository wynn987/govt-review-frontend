import React from 'react';
import * as enzyme from 'enzyme';
import * as chai from 'chai';
import Adapter from 'enzyme-adapter-react-16';
import { mountWithIntl } from '../../../../helpers/intl-enzyme-test-helper';
import Header from '../../../../../src/components/_base/layout/header/Header';
import grpLogoMain from '../../../../../src/components/_base/layout/header/grp-logo.svg';
import govtLogo from '../../../../../src/components/_base/layout/header/govt-logo.svg';
import grpLogoAffix from '../../../../../src/components/_base/layout/header/grp-affix.svg';
import { API_URL_PREFIX } from '../../../../../src/_utilities/api_url_prefix';

enzyme.configure({ adapter: new Adapter() });

describe('Header', () => {
  let render;

  before(() => {
    render = mountWithIntl(<Header />);
  });

  describe('grp logo', () => {
    let logo;

    before(() => {
      logo = render.find('#grp-header-logo');
    });

    it('has anchor to home page', () => {
      const anchor = logo.find('a');
      chai.expect(anchor.prop('href')).to.equal('/demo');
    });

    it('has grp logo main image', () => {
      const img = logo.find('img');

      chai.expect(img.prop('src')).to.equal(grpLogoMain);
      chai.expect(img.prop('alt')).to.equal('G Review Portal');
    });
  });

  describe('government logo', () => {
    let logo;

    before(() => {
      logo = render.find('#grp-gvt-logo-container');
    });

    it('has government logo image', () => {
      const src = logo.find('img');

      chai.expect(src.prop('src')).to.equal(govtLogo);
      chai.expect(src.prop('alt')).to.equal('gov.sg');
    });

    it('has an anchor to gov.sg website', () => {
      const anchor = logo.find('a').filterWhere((a) => {
        return a.props().href === 'https://www.gov.sg';
      });
      chai.expect(anchor.props().target).to.equal('_blank');
    });

    it('has anchor to contact us/feedback page', () => {
      const anchor = logo.find('a').filterWhere((a) => {
        return a.prop('href') === '/feedback';
      });
      chai.expect(anchor.text()).to.equal('Contact Us/Feedback');
    });

    it('has anchor to about us page', () => {
      const anchor = logo.find('a').filterWhere((a) => {
        return a.prop('href') === '/about_us';
      });
      chai.expect(anchor.text()).to.equal('About Us');
    });
  });

  describe('grp sticky logo', () => {
    let logo;

    before(() => {
      logo = render.find('#grp-nav-logo');
    });

    it('has anchor to home page', () => {
      const anchor = logo.find('a');
      chai.expect(anchor.prop('href')).to.equal('/');
    });

    it('has grp sticky logo', () => {
      const img = logo.find('img');

      chai.expect(img.prop('src')).to.equal(grpLogoAffix);
      chai.expect(img.prop('alt')).to.equal('Home');
    });
  });

  describe('API, Contact Us, login links', () => {
    let listItems;

    before(() => {
      listItems = render
        .find('#grp-navbar-collapse')
        .find('ul')
        .find('li');
    });

    it('renders api, contact us, log out', () => {
      const map = listItems.map(li => {
        if (li.getElement().props.children.type === 'a') {
          return li.find('a').text();
        }
        return undefined;
      });
      chai.expect(map).to.deep.equal(['API', 'Contact Us', 'LOG OUT']);
    });

    it('links news, How it works, faq, login', () => {
      const map = listItems.map(li => {
        if (li.getElement().props.children.type === 'a') {
          return li.find('a').prop('href');
        }
        return undefined;
      });
      chai.expect(map).to.deep.equal([`${API_URL_PREFIX}/api/docs`, '#', undefined]);
    });
  });
});
