import React, { Component } from "react";

export default class AboutUs extends Component {
  render() {
    return (
      <div className="p-grid aboutusPage">
        <div className="p-col-12">
          <div className="card aboutUsPageDesgin">
            {/* <h1>Welcome to WindsorEssex Economic Development Corporation</h1>
            <p>
              The WindsorEssex Economic Development Corporation is a
              not-for-profit organization supported by the City of Windsor and
              County of Essex and is responsible for advancing economic
              development to grow and sustain prosperity in the region. The main
              focus of the organization is to develop and execute strategies to
              retain, expand, attract and help start up new businesses in the
              Windsor-Essex region.
            </p>
            <p>
              The WindsorEssex Economic Development Corporation is led by a
              board of distinguished community leaders. A team of professional
              staff will assist you with all your location and investment
              decisions by working one-on-one with businesses, to facilitate the
              process of locating in Windsor-Essex.
            </p>
            <h4>WHAT WE DO</h4>
            <h5>Business Expansion &amp; Retention</h5>
            <p>
              <b>Information</b> - From site selection data, information on
              available government funding and services to market research data
              and networking opportunities, the WindsorEssex Economic
              Development Corporation is a one-stop source for the most up to
              date and relevant information on the Windsor-Essex region.
            </p>
            <p>
              <b>Advice</b> - The WindsorEssex Economic Development Corporation
              employs experienced professionals who can answer your questions on
              general business practices, expansion planning, multi-national
              branch planning, and even link you with the most up to date
              information on exporting.
            </p>
            <p>
              <b>Assistance</b> – The WindsorEssex Economic Development
              Corporation will bring you together with the right people and
              expertise you need to succeed. Our team will help you cut through
              red tape by providing the resources that can connect you with the
              decision makers, identify and connect you with potential funders,
              help you network with partners and allies, and link you to
              educational and training resources to meet your needs.
            </p>
            <h5>Business Attraction</h5>
            <p>
              Since its inception, the WindsorEssex Economic Development
              Corporation has assisted many national and international companies
              in their efforts to locate in the Windsor-Essex Region. We will
              assist you with your investment analysis at every stage. From
              workforce data and staffing considerations, through site selection
              and providing an in depth knowledge of operating a business in
              Ontario and Canada. We will provide information and identify
              solutions that will enhance your business prospects. We will
              leverage our community and business relationships to provide you
              with guidance and support before and after your decision to invest
              in the Windsor-Essex region.
            </p>
            <h5>Small Business Centre</h5>
            <p>
              A part of Ministry of Economic Development, Employment and
              Infrastructure Small Business Support Network
            </p>
            <p>
              The Small Business Centre is part of a network of offices that
              serve Ontario's small business community. Operating locally as a
              department of the WindsorEssex Economic Development Corporation,
              the centre is a source for small business information, guidance
              and professional advice on starting and operating a small
              business. Whether you are just getting started or looking to
              expand your business, we are here to help your business succeed.
            </p>
            <p>
              We provide easy access to information, resources, workshops and
              complimentary consultations on all aspects of your business needs
              every step of the way. Including help with your business concept,
              preparing your business plan, research assistance, registering
              your business and learning about other government requirements and
              programs.
            </p> */}
            <div className="HomePageBanner">
              <img
                src={window.location.origin + "/assets/images/dashBoardMap.jpg"}
                alt=""
                width="100%"
                height="100%"
              />
            </div>
            <div className="HomePageBannerText">
              <h1 className="HomePageDesign">
                Our Location, <br />
                Your Advantage
              </h1>
              <p className="HomePageDesignParagraph">
                More than 200 million people located within a 13-hour drive.
              </p>
              <p className="HomePageDesignDownParagraph">
                Windsor-Essex is situated at the heart of the richest consumer
                market in the world, with more than 200 million people located
                within a 13-hour drive.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
