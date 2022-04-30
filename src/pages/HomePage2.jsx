import React, { Component } from "react";
import Header from "../layout/components/Header";
//import { UncontrolledCarousel } from "reactstrap";
import GoogleMapReact from "google-map-react";
import { MapMarker } from "../components/MapMarker";
import { Carousel } from "primereact/carousel";
import { Button } from "primereact/button";
import ShowMoreText from "react-show-more-text";
import { Link } from "react-router-dom";
import { companiesData } from "../_helpers/companyData";
import { companyService } from "../_services/company.service";
const items = [
  {
    src: "/assets/images/amd_building.jpg",
    altText: "AMD",
    caption:
      "Advanced Micro Devices, Inc. is an American multinational semiconductor company based in Santa Clara, California, that develops computer processors and related technologies for business and consumer markets.",
    header: "AMD",
    key: "1"
  },
  {
    src: "/assets/images/ibm_building.jpg",
    altText: "IBM",
    caption:
      "International Business Machines Corporation is an American multinational technology company headquartered in Armonk, New York.",
    header: "IBM",
    key: "2"
  },
  {
    src: "/assets/images/corporate_center.jpg",
    altText: "Jones Deslauriers",
    caption:
      "Jones DesLauriers is a Navacord broker partner, one of Canada’s largest commercial insurance brokers.",
    header: "Jones Deslauriers",
    key: "3"
  },
  {
    src: "/assets/images/banner-coopers-hawk.jpg",
    altText: "Coopers Hawk",
    caption: "",
    header: "",
    key: "4"
  }
];

const companyMarkerList = [
  {
    lat: 42.2679371,
    lng: -83.0119475,
    text: "A & A Insurance Brokers Ltd"
  },
  {
    lat: 42.306922,
    lng: -82.9739764,
    text: "F&j Collision Windsor Ltd"
  },
  {
    lat: 42.310119,
    lng: -83.0243899,
    text: "F&j Collision Windsor Ltd"
  },
  {
    lat: 42.3123708,
    lng: -83.0710053,
    text: "Windsor Essex Community Health Centre"
  }
];

const mapOptions = {
  center: {
    lat: 42.317432,
    lng: -83.026772
  },
  zoom: 11
};

const AnyReactComponent = ({ text }) => <div>{text}</div>;
export default class HomePage2 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sector: "",
      location: "",
      companies: Object.keys(companiesData).map((key) => {
        return { ...companiesData[key], key };
      }),
      companiesData: []
    };

    this.responsiveOptions = [
      {
        breakpoint: "1024px",
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: "600px",
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: "480px",
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  componentDidMount() {
    this.featuredCompanyList();
  }
  featuredCompanyList = () => {
    companyService.featuredCompanyList().then((data) => {
      if (data) {
        this.setState({ companiesData: data.Data });
      }
    });
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSearch = (e) => {
    this.props.history.push(
      `\search?sector=${this.state.sector}&location=${this.state.location}`
    );
  };

  header = (company) => {
    return (
      <img
        alt="Card"
        src={company.image}
        onError={(e) =>
          (e.target.src =
            "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
        }
      />
    );
  };

  footer = (company) => {
    return (
      <span>
        <Button label="Save" icon="pi pi-check" />
        <Button
          label="Cancel"
          icon="pi pi-times"
          className="p-button-secondary p-ml-2"
        />
      </span>
    );
  };

  productTemplate(product) {
    return (
      <div className="card">
        <div className="product-item-content">
          <div className="p-mb-3">
            <img
              src={product.image}
              onError={(e) =>
                (e.target.src =
                  "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
              }
              alt={product.name}
              className="product-item company-carousel-image"
            />
          </div>
          <div>
            <h4 className="p-mb-1">{product.name}</h4>
            <span
              className={`product-badge status-${product.inventoryStatus.toLowerCase()}`}
            >
              {product.inventoryStatus}
            </span>
            <div className="car-buttons p-mt-5">
              <Button
                icon="pi pi-search"
                className="p-button p-button-rounded p-mr-2"
              />
              <Button
                icon="pi pi-star"
                className="p-button-success p-button-rounded p-mr-2"
              />
              <Button
                icon="pi pi-cog"
                className="p-button-help p-button-rounded"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  companyTemplate(company) {
    const header = (
      <img
        alt="Card"
        src={company.image}
        onError={(e) =>
          (e.target.src =
            "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
        }
      />
    );
    const footer = (
      <span>
        <Button label="Save" icon="pi pi-check" />
        <Button
          label="Cancel"
          icon="pi pi-times"
          className="p-button-secondary ml-2"
        />
      </span>
    );
    return (
      <div className="card card-padding-none" style={{ width: "18rem" }}>
        <img
          className="card-img-top card-img-height"
          src={
            company.companyLogo
              ? company.companyLogo
              : "assets/images/logo-16.svg"
          }
          alt="Card image cap"
        />
        <div className="card-body">
          <h5 className="card-title">{company.demographics.companyTitle}</h5>
          <div className="card-text featured-card-text">
            <ShowMoreText
              /* Default options */
              lines={3}
              more="Show more"
              less="Show less"
              anchorClass=""
              expanded={false}
            >
              <p className="card-text">{company.demographics.description}</p>
            </ShowMoreText>
          </div>

          <Link
            to={`/company-details/${company._id}`}
            className="btn btn-primary"
          >
            View More
          </Link>
        </div>
      </div>
    );
  }

  render() {
    return (
      <>
        <Header />
        <div className="map-container">
          <div className="map">
            <GoogleMapReact
              bootstrapURLKeys={{
                key: "AIzaSyD6GGik6mcxsZbKw60nof5NwYubIleeSYE"
              }}
              defaultCenter={mapOptions.center}
              defaultZoom={mapOptions.zoom}
            >
              {companyMarkerList.map((company) => {
                return (
                  <MapMarker
                    lat={company.lat}
                    lng={company.lng}
                    text={company.text}
                  />
                );
              })}
            </GoogleMapReact>
          </div>
          <div className="main-search-inner-block">
            <div className="container">
              <form>
                <div className="row">
                  <div className="col-md-12">
                    <div className="main-search-input">
                      <div className="main-search-input-item">
                        <input
                          type="text"
                          className="search-input"
                          id="sector"
                          name="sector"
                          value={this.state.sector}
                          onChange={this.handleInputChange}
                          placeholder="Which sector? (E.g Agriculture)"
                        />
                      </div>
                      <div className="main-search-input-item border-right-none">
                        <input
                          type="text"
                          className="search-input"
                          id="location"
                          name="location"
                          value={this.state.location}
                          onChange={this.handleInputChange}
                          placeholder="Where? (E.g Ouellette)"
                        />
                      </div>
                      <button
                        type="button"
                        className="main-search-button button"
                        onClick={this.handleSearch}
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="container">
          {/* <UncontrolledCarousel items={items} /> */}
          <div className="row">
            <div className="col-12">
              <h3 className="mt-5 headline centered margin-bottom-45">
                <strong className="headline-with-separator">
                  Featured Companies
                </strong>
              </h3>
              <Carousel
                value={this.state.companiesData}
                numVisible={3}
                numScroll={3}
                responsiveOptions={this.responsiveOptions}
                className="custom-carousel"
                circular
                itemTemplate={this.companyTemplate}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}
