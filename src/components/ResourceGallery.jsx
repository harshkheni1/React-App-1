import React, { Component } from "react";
import ResourceThumbnail from "./ResourceThumbnail";
export default class ResourceGallery extends Component {
  render() {
    const { list } = this.props;
    return (
      <div className="resource-gallery">
        {list.map((file, index) => {
          return (
            <ResourceThumbnail
              file={file}
              key={index}
              onSelectFile={this.props.onSelectFile}
            />
          );
        })}
      </div>
    );
  }
}
