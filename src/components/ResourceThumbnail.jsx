import React, { Component } from "react";
import { formService } from "../_services";
import { getFileType, getFileExtension } from "../_helpers/_helperFunctions";
import VideoThumbnail from "react-video-thumbnail";
import { FileIcon, defaultStyles } from "react-file-icon";

export default class ResourceThumbnail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fileUrl: "",
      fileType: "",
      fileExtension: ""
    };
  }

  async componentDidMount() {
    let { file } = this.props;
    let loadedFile = await formService.getObjectFromS3NoAuth(file?.key);
    let fileExtension = getFileExtension(file.key);
    let fileType = getFileType(fileExtension);
    this.setState({ fileUrl: loadedFile, fileType, fileExtension });
  }

  renderBasedOnType = () => {
    let { fileType, fileUrl, fileExtension } = this.state;
    let { file, onSelectFile } = this.props;
    switch (fileType) {
      case "video":
        return (
          <div
            className="video-thumb"
            onClick={() => onSelectFile(file, fileType)}
          >
            <VideoThumbnail videoUrl={file.location} />
          </div>
        );
      case "image":
        return (
          <img
            src={fileUrl}
            className="img-gallery"
            alt={file.title}
            onClick={() => onSelectFile(file, fileType)}
          />
        );
      default:
        return (
          <div
            className="file-icon"
            onClick={() => onSelectFile(file, fileType)}
          >
            <FileIcon
              extension={fileExtension}
              {...defaultStyles[fileExtension]}
            />
          </div>
        );
    }
  };
  render() {
    return this.renderBasedOnType();
  }
}
