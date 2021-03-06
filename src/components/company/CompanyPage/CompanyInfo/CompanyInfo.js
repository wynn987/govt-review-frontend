import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
// import { resolve } from 'react-resolver';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faGlobe from '@fortawesome/fontawesome-free-solid/faGlobe';
import faPhone from '@fortawesome/fontawesome-free-solid/faPhone';
import API from '../../../../_utilities/api';
import { API_URL_PREFIX } from '../../../../_utilities/api_url_prefix';
import PageLoadSpinner from '../../../animation/PageLoadSpinner';
import './CompanyInfo.scss';

export default class CompanyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grantData: null,
      clientData: null
    };
  }

  componentDidMount() {
    const { id } = this.props.companyData;
    let url = `${API_URL_PREFIX}/api/v1/companies/${id}/clients`;
    this._asyncRequest = API.get({
      url,
      data: {
        sort_by: 'created_at',
        filter_by: 'nil',
        desc: 'true',
        page: 1,
        per_page: 3
      }
    }).then(clientData => {
      this.setState({ clientData });
    }).fail(() => {
      const clientData = 'Fail';
      this.setState({ clientData });
    });
    url = `${API_URL_PREFIX}/api/v1/companies/${id}/grants`;
    this._asyncRequest = API.get({
      url,
      data: {
        sort_by: 'reviews_count',
        filter_by: 'nil',
        desc: 'true',
        page: 1,
        per_page: 3
      }
    }).then(grantData => {
      this.setState({ grantData });
    }).fail(() => {
      const grantData = 'Fail';
      this.setState({ grantData });
    });
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  getIndustryString(industriesArray) {
    const len = industriesArray.length;

    if (len === 0) {
      return '';
    }

    let industryString = industriesArray[0].name;
    if (len > 1) {
      let i = 1;
      for (i, len; i < len; i++) {
        industryString += `, ${industriesArray[i].name}`;
      }
    }
    return industryString;
  }

  getProjectsString(projectsArray) {
    if (!projectsArray) {
      return '';
    }

    const len = projectsArray.length;
    if (len === 0) {
      return '';
    }

    let projectString = projectsArray[0].name;
    if (len > 1) {
      let i = 1;
      for (i, len; i < len; i++) {
        projectString += `, ${projectsArray[i].name}`;
      }
    }
    return projectString;
  }

  generatePrevClients(clientData) {
    if (clientData !== 'Fail') {
      return (
        <Col sm={6}>
          <div className="companyinfo-subheader">
            <FormattedMessage id="companyinfo-previous-clients" />
          </div>
          <div className="client-images">
          { clientData.map((data) => {
            return <span key={data.name}><a href={`/demo/company/${data.id}`}><img src={data.image.thumb.url} alt={data.name} title={data.name} /></a></span>;
           })}
          </div>
        </Col>
      );
    }
    return <div />;
  }

  generateGrants(grantData) {
    if (grantData !== 'Fail') {
      return (
        <Col sm={6}>
          <div className="companyinfo-subheader">
            <FormattedMessage id="companyinfo-grants-experience" />
          </div>
          <div className="grants-experience">
          {grantData.map((data) => {
            return <li key={data.name}><span>{data.name}</span></li>;
            })}
          </div>
        </Col>
      );
    }
    return <div />;
  }

  render() {
    const { companyData } = this.props;
    const industryString = this.getIndustryString(companyData.industries);
    const projectString = this.getProjectsString(companyData.project_industries);
    if (!this.state.grantData || !this.state.clientData) {
      return (
        <div className="page-load-spinner">
          <PageLoadSpinner />
        </div>
      );
    }
    return (
      <div className="vendor-card">
        <Col xs={12}>
          <Row className="vendor-item">
            <Col xs={1} className="companyinfo-logo-box">
              <img src={companyData.image.thumb.url} alt={companyData.name} title={companyData.name} />
            </Col>
            <Col xs={8}>
              <span className="vendor-name">{companyData.name}</span>
              {companyData.uen &&
              <span className="vendor-uen"><FormattedMessage id="companyinfo.uen" />{companyData.uen}</span>}
              <div className="vendor-industry">{industryString}</div>
            </Col>
          </Row>
          <Row className="vendor-description">
            <Col xs={10}>
              <div className="vendor-description-text">
                {companyData.description}
              </div>
            </Col>
          </Row>
          <Row className="vendor-contact-details">
            <Col xs={9}>
              <span className="vendor-website">
                <FontAwesomeIcon icon={faGlobe} className="contact-icon" />
                <a href={companyData.url} target="_blank">{companyData.url}</a>
              </span>
              <span className="vendor-phone">
                <FontAwesomeIcon icon={faPhone} className="contact-icon" />
                {companyData.phone_number}
              </span>
            </Col>
          </Row>
          {projectString !== '' &&
            <Row className="companyinfo-has-done">
              <Col xs={9}>
                <div className="companyinfo-has-done"><FormattedMessage id="companyinfo-has-done" /></div>
                <div className="companyinfo-has-done-text">{projectString}</div>
              </Col>
            </Row>
          }
          <div className="companypage-border" />
          <Row>
            {this.generatePrevClients(this.state.clientData)}
            {this.generateGrants(this.state.grantData)}
          </Row>
        </Col>
      </div>
    );
  }
}

