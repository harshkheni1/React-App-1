import React, { Component } from "react";
import { connect } from "react-redux";
import { InputText } from "primereact/inputtext";
import { Button, Navbar, Nav, Modal, NavLink } from "react-bootstrap";
// import { NavLink } from "react-router-dom";
import { setSearchTerm } from "../../redux-store/action";
// import Logo from "../../../public/assets/images/weedc_logo_white.svg";
function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    setSearchTerm: (data) => {
      dispatch(setSearchTerm(data));
    }
  };
}
class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      globalSearch: "",
      navbar: true,
      location: this.props.history.location.pathname,
      show: false
    };
  }

  globalSearch = (e) => {
    e.preventDefault();
    this.props.setSearchTerm(this.state.globalSearch);
    this.props.history.push(`/search?search=${this.state.globalSearch}`);
  };

  changebackgroundcolor = () => {
    if (window.scrollY >= 30) {
      this.setState({ navbar: false });
    } else {
      this.setState({ navbar: true });
    }
  };
  componentDidMount() {
    this.windowFunction();
  }

  windowFunction = () => {
    window.addEventListener("scroll", this.changebackgroundcolor);
  };

  render() {
    let close = () => this.setState({ show: false });
    return (
      <>
        {this.state.location == "/" ? (
          <>
            {this.state.navbar ? (
              // { console.log("this.state.location: ", this.state.location) }
              <Navbar
                style={{
                  backgroundColor: "#0075c9",
                  paddingLeft: "0",
                  paddingRight: "0"
                }}
                fixed="top"
                variant="dark"
                expand="lg"
              >
                <div className="container">
                  <div className="row w-100 m-0">
                    <div className="col-md-6"></div>
                    <div className="col-md-6 ml-auto pr-0">
                      <Navbar.Toggle aria-controls="basic-navbar-nav" />
                      <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                          <a
                            target="_blank"
                            href="https://www.investwindsoressex.com/en/about-us/about-us.aspx"
                            className="text-white"
                            style={{ fontSize: "15px" }}
                          >
                            About Us
                          </a>
                          <a
                            target="_blank"
                            href="https://www.investwindsoressex.com/en/about-us/media.aspx"
                            className="text-white"
                            style={{ fontSize: "15px" }}
                          >
                            Media
                          </a>
                          <a
                            target="_blank"
                            href="https://www.investwindsoressex.com/Modules/News/en"
                            className="text-white"
                            style={{ fontSize: "15px" }}
                          >
                            News
                          </a>
                          <a
                            target="_blank"
                            href="https://www.investwindsoressex.com/en/about-us/contact-us.aspx"
                            className="text-white"
                            style={{ fontSize: "15px" }}
                          >
                            Contact Us
                          </a>
                        </Nav>
                      </Navbar.Collapse>
                    </div>
                    {/* <div className="col-lg-1"></div> */}
                  </div>
                </div>
              </Navbar>
            ) : null}
          </>
        ) : (
          <>
            <Navbar
              id="header"
              className="navbar-custom weedc-bg"
              collapseOnSelect
              expand="lg"
              fixed="top"
              variant="dark"
            >
              <div className="container">
                <Navbar.Brand href="/">
                  <img
                    src="/assets/images/weedc_logo_white.svg"
                    style={{ height: "50px", width: "149px" }}
                    alt="weedc logo"
                  />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <div className="navigationheader">
                  <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav>
                      <ul className="nav header-nav ml-auto">
                        <li className="nav-item">
                          <Nav.Link
                            className="nav-link active text-white"
                            href="/listings?0"
                            style={{
                              fontWeight: "800",
                              fontSize: "15px",
                              padding: "0px 10px"
                            }}
                          >
                            Browse by Municipalities
                            {/* LOCATE START EXPAND PROMOTE */}
                          </Nav.Link>
                        </li>
                        <li className="nav-item">
                          <Nav.Link
                            className="nav-link active text-white"
                            href="/listings?1"
                            style={{
                              fontWeight: "800",
                              fontSize: "15px",
                              padding: "0px 10px"
                            }}
                          >
                            Browse by Sectors
                          </Nav.Link>
                        </li>

                        <li className="nav-item">
                          <Nav.Link
                            className="nav-link text-white"
                            href="/login"
                            style={{
                              fontWeight: "800",
                              fontSize: "15px",
                              padding: "0px 10px"
                            }}
                          >
                            Sign In
                          </Nav.Link>
                        </li>
                        <li className="nav-item">
                          <NavLink
                            onClick={() => this.setState({ show: true })}
                            className="searchbtn mt-2"
                          >
                            <i
                              className="pi pi-search"
                              style={{ color: "white" }}
                            />
                          </NavLink>
                        </li>
                      </ul>
                    </Nav>
                  </Navbar.Collapse>
                </div>
              </div>
            </Navbar>
            <Modal
              show={this.state.show}
              onHide={close}
              className="search-modal"
            >
              <Modal.Body>
                <span
                  onClick={close}
                  className="pi pi-times"
                  style={{ cursor: "pointer" }}
                ></span>
                <div className="serchbox-ml">
                  <form onSubmit={this.globalSearch}>
                    <i className="pi pi-search" />
                    <InputText
                      type="search"
                      placeholder="What are you looking for?"
                      className="serchinput"
                      onChange={(e) => {
                        this.setState({
                          globalSearch: e.target.value
                        });
                      }}
                    />
                    <Button
                      type="submit"
                      onClick={() => {
                        close();
                      }}
                    >
                      Search
                    </Button>
                  </form>
                </div>
              </Modal.Body>
            </Modal>
          </>
        )}
      </>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Header);
