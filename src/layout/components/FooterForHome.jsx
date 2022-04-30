import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fafacebook } from "@fortawesome/free-solid-svg-icons";

const FooterForHome = () => {
  return (
    <>
      <section className="footer">
        <div className="bootmfooter">
          <div className="container">
            {/* <div className="row"> */}
            <div className="footerHomePage_forResponsive d-flex justify-content-between text-white w-100 pl-2 pr-2">
              <div className="pb-sm-5">
                <img
                  className="ResponsiveImg"
                  src="/assets/images/weedc_logo_white.svg"
                  style={{ width: "344px" }}
                />
              </div>
              {/* <div className="col-lg-2 text-white  d-flex flex-column align-items-end "> */}
              <div style={{ maxWidth: `300px` }}>
                <div
                  className="borderResponsive"
                  style={{
                    borderLeft: "1px solid rgba(255,255,255,0.2)",
                    padding: "0 0 0 95px"
                  }}
                >
                  <h5>Main office:</h5>
                  <p style={{ fontSize: "15px" }}>
                    119 Chatham St. W, Unit 100 Windsor, ON N9A 5M7{" "}
                  </p>
                  <div style={{ lineHeight: "5px", fontSize: "15px" }}>
                    <p>
                      Phone:{" "}
                      <a
                        href="tel:519.255.9200"
                        className="text-white font-weight-bold"
                      >
                        519.255.9200{" "}
                      </a>
                    </p>
                    <p>
                      Toll Free:{" "}
                      <a
                        href="tel:1.888.255.9332"
                        className="text-white font-weight-bold"
                      >
                        1.888.255.9332{" "}
                      </a>
                    </p>
                    <p>
                      Fax:{" "}
                      <a
                        href="tel:519.255.9987"
                        className="text-white font-weight-bold"
                      >
                        519.255.9987{" "}
                      </a>
                    </p>
                    <a
                      href="https://www.investwindsoressex.com/en/about-us/contact-us.aspx"
                      target="_blank"
                      className="text-white font-weight-bold"
                    >
                      Contact Us{" "}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* </div> */}
        </div>
        <div className="footerDiv1 contactfooter">
          <div className="container">
            <div
              className="row footerDiv1 align-items-center"
              style={{ paddingBottom: "10px" }}
            >
              <div className="ResponsiveLinks col-xl-9 col-lg-9 col-md-9 col-sm-9 col-12">
                {/* <a
                  href="https://www.investwindsoressex.com/en/about-us/accessibility.aspx"
                  target="_blank"
                  className="footerLink"
                >
                  Accessibility
                </a> */}
                <a
                  href="https://www.investwindsoressex.com/en/about-us/contact-us.aspx"
                  target="_blank"
                  className="footerLink"
                >
                  Contact Us
                </a>
                <a
                  href="https://www.investwindsoressex.com/en/privacy-policy.aspx"
                  target="_blank"
                  style={{
                    color: "#fff",
                    fontWeight: "bolder",
                    fontSize: "large"
                  }}
                >
                  Privacy Policy
                </a>
              </div>

              {/* Social Media Icon */}
              <div className="socialBtnResponsive col-xl-3 col-lg-3 col-sm-12 col-12 d-flex justify-content-end">
                <a
                  className="btn btn-light footerBtn"
                  href="https://www.facebook.com/investwindsoressex"
                  target="_blank"
                >
                  <img
                    src="/assets/icons/facebook-f-brands.svg"
                    width="16px"
                    alt=""
                  />
                </a>
                <a
                  className="btn btn-light footerBtn"
                  href="https://twitter.com/_investwe"
                  target="_blank"
                >
                  <img
                    src="/assets/icons/twitter-brands.svg"
                    width="16px"
                    alt=""
                  />
                </a>
                <a
                  className="btn btn-light footerBtn"
                  href="https://www.youtube.com/channel/UCvZZkI9IWiB0eVEyQOPPcug"
                  target="_blank"
                >
                  <img
                    src="/assets/icons/youtube-brands.svg"
                    width="16px"
                    alt=""
                  />
                </a>
                <a
                  className="btn btn-light footerBtn lastLink"
                  href="https://www.linkedin.com/company/investwindsoressex/"
                  target="_blank"
                >
                  <img
                    src="/assets/icons/linkedin-in-brands.svg"
                    width="16px"
                    alt=""
                  />
                </a>
              </div>
            </div>
            <div className="CopyrightResponsive footer_boottom text-white">
              <div>
                <p>© Copyright 2021 Invest WindsorEssex</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FooterForHome;
