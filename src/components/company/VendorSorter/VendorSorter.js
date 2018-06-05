import React, { Component } from 'react';
import { Nav, NavItem, Row, Col, FormControl, FormGroup, ControlLabel } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import ReactPaginate from 'react-paginate';
import VendorListingBox from '../VendorListingBox/VendorListingBox';
// import API from '../../../_utilities/api';
import './VendorSorter.scss';

export default class VendorSorter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedView: 'best_ratings',
      activePage: 1,
      itemsCountPerPage: 5,
      totalItemsCount: 0,
      searchText: ''
    };
    this.searchText = React.createRef();
    this.handlePageChange = this.handlePageChange.bind(this);
    this.updatePagination = this.updatePagination.bind(this);
    this.searchCompany = this.searchCompany.bind(this);
    this.generateFilterString = this.generateFilterString.bind(this);
    this.getEndCount = this.getEndCount.bind(this);
  }

  handleSelect(eventKey, event) {
    event.preventDefault();
    this.setState({
      selectedView: eventKey,
      activePage: 1
    });
  }

  handlePageChange(pageNumber) {
    this.setState({
      activePage: pageNumber.selected + 1
    });
    window.scrollTo(0, 0);
  }

  updatePagination(itemsCount) {
    if (itemsCount !== this.state.totalItemsCount) {
      this.setState({
        totalItemsCount: itemsCount
      });
    }
  }

  searchCompany(e) {
    e.preventDefault();
    this.setState({
      searchText: this.input.value
    });
  }

  generateFilterString() {
    let filterUrl = '';
    for (const id of this.props.industryFilter) filterUrl += `industries:${id},`;
    return filterUrl.substr(0, filterUrl.length - 1);
  }

  getEndCount() {
    return Math.min(this.state.itemsCountPerPage * this.state.activePage, this.state.totalItemsCount);
  }

  render() {
    const filter = this.generateFilterString();
    return (
      <div>
        <Row>
          <Col sm={12}>
          <div className="col-xs-12">
            <form onSubmit={this.searchCompany}>
              <FormGroup validationState={null}>
                <ControlLabel>
                  <FormattedMessage id="vendorsorter.find.consultants" />
                </ControlLabel>
                <FormattedMessage id="vendorsorter.search.company">
                  { message => (
                    <FormControl
                      id="company-search-bar"
                      type="text"
                      placeholder={message}
                      inputRef={ref => { this.input = ref; }}
                    />
                    )
                  }
                </FormattedMessage>
              </FormGroup>
            </form>
          </div>
            <Nav className="nav-sorter" bsStyle="tabs" activeKey={this.state.selectedView} onSelect={(k, event) => this.handleSelect(k, event)}>
              <NavItem eventKey="best_ratings">
                <FormattedMessage id="vendorsorter.best.ratings" />
              </NavItem>
              <NavItem eventKey="newly_added" id="newly_added">
                <FormattedMessage id="vendorsorter.newly.added" />
              </NavItem>
              <div className="total-items">
                {this.state.totalItemsCount !== 0 &&
                <FormattedMessage id="vendorsorter.total.items"
                  values={
                    {
                      startCount: (this.state.itemsCountPerPage * (this.state.activePage - 1) + 1),
                      endCount: (this.getEndCount()),
                      totalItemsCount: this.state.totalItemsCount
                    }
                  }
                />}
              </div>
            </Nav>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <VendorListingBox
              selectedView={this.state.selectedView}
              activePage={this.state.activePage}
              itemsCountPerPage={this.state.itemsCountPerPage}
              updatePagination={this.updatePagination}
              searchText={this.state.searchText}
              filter={filter}
              className="vendor-listing-box"
            />
          </Col>
        </Row>
        <ReactPaginate
          pageCount={Math.ceil(this.state.totalItemsCount / this.state.itemsCountPerPage)}
          forcePage={this.state.activePage - 1}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          previousLabel="PREV"
          nextLabel="NEXT"
          breakLabel={<a className="btn btn-break">...</a>}
          onPageChange={this.handlePageChange}
          containerClassName="pagination"
          pageLinkClassName="btn btn-default"
          previousLinkClassName="prev-next prev"
          nextLinkClassName="prev-next next"
        />
      </div>
    );
  }
}
