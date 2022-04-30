import React, { Component } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import FileViewer from "react-file-viewer";
import { IMAGE_TYPES } from "../_helpers";
const styles = {
  minHeight: "400px",
  minWidth: "700px",
};
export class CustomModal extends Component {
  renderFile = () => {
    if (IMAGE_TYPES.includes(this.props.fileType)) {
      return (
        <div style={styles}>
          <img 
            src={this.props.filePath}
            className="img-fluid img-size"
            alt="resource file"
          />
        </div>
      );
    } else {
      return (
        <div style={styles}>
          <FileViewer
            fileType={this.props.fileType}
            filePath={this.props.filePath}
          />
        </div>
      );
    }
  };
  render() {
    const { open } = this.props;
    return (
      <Modal open={open} onClose={this.props.onCloseModal}>
        <h3>{this.props.fileName}</h3>
        {this.renderFile()}
      </Modal>
    );
  }
}
