import React, { Component } from "react";
import { BreadCrumb } from "primereact/breadcrumb";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Dialog } from "primereact/dialog";
import { highlightService, authenticationService } from "../../_services";
import moment from "moment";
import { resetWarningCache } from "prop-types";
export default class HighlightsHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: authenticationService.currentUserValue,
      highlightlistGlobalFilter: null,
      historyData: [],
      viewData: {},
      highlightViewModal: false,
    };
  }

  componentDidMount() {
    this.getHistoryofHighlights();
  }

  getHistoryofHighlights = () => {
    let currentUserId = this.state.currentUser.id;

    highlightService.getHistoryofHighlights(currentUserId).then((data) => {
      if (data && data.Status) {
        this.setState({ historyData: data.Data });
      }
    });
  };

  toggleHighlightView = (rowData) => {
    this.setState({ viewData: rowData, highlightViewModal: true });
  };

  closeHighlightViewModal = () => {
    this.setState({ highlightViewModal: false });
  };

  actionTemplate = (rowData) => {
    return (
      <div className="action-container ">
        <span
          className="cursor-pointer"
          data-toggle="tooltip"
          title="View"
          onClick={(e) => this.toggleHighlightView(rowData)}
        >
          <FontAwesomeIcon icon={faEye} />
        </span>
      </div>
    );
  };

  statusTemplate = (rowData) => {
    return (
      <div className="action-container">
        <span
          className="cursor-pointer text-primary"
          data-toggle="tooltip"
          title="Edit"
        >
          {rowData.status == 1 ? (
            <span className="badge badge-success">Approved</span>
          ) : (
            <span className="badge badge-danger">Pending</span>
          )}
        </span>
      </div>
    );
  };
  dateTemplate = (rowData) => {
    return moment(rowData.updatedAt).format("MM/DD/YYYY hh:mm a");
  };

  render() {
    const { viewData } = this.state;
    const items = [{ label: "Company Announcements History" }];
    const home = { icon: "pi pi-home", url: "/aboutus" };
    return (
      <>
        <BreadCrumb model={items} home={home} className="mb-3" />
        <div className="p-grid HighlightsHistoryPage">
          <div className="p-col-12">
            <div className="datatable-filter">
              <div className="card">
                <div className="text-right mb-2">
                  <Link to="/add-highlight" className="btn btn-primary">
                    Add New Announcement
                  </Link>
                  <div className="mt-3 table-header">
                    <h2>History of Company Announcements</h2>
                    <span className="p-input-icon-left ">
                      <i className="pi pi-search" />
                      <InputText
                        className="searchInput"
                        type="search"
                        onInput={(e) =>
                          this.setState({
                            highlightlistGlobalFilter: e.target.value,
                          })
                        }
                        placeholder="Search"
                      />
                    </span>
                  </div>
                </div>
                <div className="custom-responsive">
                  <DataTable
                    value={this.state.historyData}
                    className="p-datatable-striped"
                    paginator
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                    rows={10}
                    globalFilter={this.state.highlightlistGlobalFilter}
                    rowsPerPageOptions={[10, 20, 50]}
                  >
                    <Column
                      field="highlightType"
                      header="Company Announcements Type"
                      sortable
                    ></Column>
                    <Column
                      field="headline"
                      header="Headline"
                      sortable
                    ></Column>
                    <Column
                      field="updatedAt"
                      header="Created"
                      sortable
                      body={this.dateTemplate}
                    ></Column>
                    <Column body={this.statusTemplate} header="Status"></Column>
                    <Column body={this.actionTemplate} header="Action"></Column>
                  </DataTable>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Dialog
          header={"Company Announcements"}
          visible={this.state.highlightViewModal}
          style={{ width: "90vw" }}
          onHide={this.closeHighlightViewModal}
        >
          <div className="company-info-details">
            <div className="company-info-box p-2">
              <h4 className="py-2">Announcement Type</h4>
              <p>{viewData.highlightType}</p>
            </div>

            <div className="company-info-box p-2">
              <h4 className="py-2">Headline</h4>
              <p>{viewData.headline}</p>
            </div>
            <div className="company-info-box p-2">
              <h4 className="py-2">Status</h4>
              {viewData.status == 1 ? <p>Active</p> : <p>InActive</p>}
            </div>

            <div className="company-info-box p-2">
              <h4 className="py-2">Email Address</h4>
              <p>{viewData.emailAddress}</p>
            </div>
            {/* <div className="company-info-box p-2">
              <h4 className="py-2">Point Of Contact</h4>
              <p>{viewData.pointOfContact}</p>
            </div> */}

            <div className="company-info-box p-2">
              <h4 className="py-2">Media Contact</h4>
              <p>{viewData.pressContact}</p>
            </div>
            <div className="company-info-box p-2">
              <h4 className="py-2">Body</h4>
              <p>{viewData.bodyCopy}</p>
            </div>
            <div className="company-info-box p-2">
              <h4 className="py-2">Phone Number</h4>
              <p>{viewData.phoneNumber}</p>
            </div>

            <div className="company-info-box p-2">
              <h4 className="py-2">Created</h4>
              <p>{moment(viewData.createdAt).format("MM/DD/YYYY hh:mm a")}</p>
            </div>
          </div>
        </Dialog>
      </>
    );
  }
}
