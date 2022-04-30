import React, { Component } from "react";
import { formService } from "../_services";
import { getFileType, getFileExtension } from "../_helpers/_helperFunctions";
import ReactPlayer from "react-player";
import FileViewer from "react-file-viewer";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
export default class ResourceViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fileUrl: "",
      fileType: "",
      fileExtension: ""
    };
  }

  async componentDidUpdate(prevProps) {
    if (this.props.file?.title !== prevProps.file?.title) {
      let { file } = this.props;
      let loadedFile = await formService.getObjectFromS3NoAuth(file?.key);
      let fileExtension = getFileExtension(file.key);
      let fileType = getFileType(fileExtension);
      this.setState({ fileUrl: loadedFile, fileType, fileExtension });
    }
  }

  renderBasedOnType = () => {
    let { fileType, fileUrl, fileExtension } = this.state;
    console.log("fileType: ", fileType);
    let { file } = this.props;

    switch (fileType) {
      case "video":
        return (
          <ReactPlayer
            className="react-player video-player"
            url={fileUrl}
            // light = {true}
            controls
            width="100%"
            height="516px"
          />
        );
      case "audio":
        return (
          <ReactPlayer
            className="react-player"
            url={fileUrl}
            // light = {true}
            controls
            width="100%"
            height="100%"
          />
        );
      case "docs":
        return (
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${file.location}`}
            width="100%"
            height="600px"
            frameBorder="0"
          />
        );
      case "image":
        return (
          <img
            src={fileUrl}
            className="img-fluid img-size"
            alt="resource file"
          />
        );
      default:
        return null;
    }
  };

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        centered={true}
        toggle={this.props.toggle}
        size="lg"
      >
        <ModalHeader toggle={this.props.toggle}>
          {this.props.file?.title}
        </ModalHeader>
        <ModalBody className="p-0">{this.renderBasedOnType()}</ModalBody>
      </Modal>
    );
  }
}
