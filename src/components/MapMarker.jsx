import React from "react";

export function MapMarker({ text, address }) {
  return (
    <div>
      <img
        src="/assets/icons/building-location.svg"
        className="map-marker"
      ></img>
      <div className="card map-popup">
        <div className="">
          <p className="mb-0">
            {" "}
            <strong>Company Name :</strong> {text}
          </p>
          <p className="mb-0">
            <strong>Address : </strong> {address}
          </p>
        </div>
      </div>
    </div>
  );
}
