import React, { Component } from "react";
import moment from "moment";
import { uuid } from "uuidv4";
import { formService } from "../_services";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo, faSave, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FileIcon, defaultStyles } from "react-file-icon";
// import {SketchField, Tools} from 'react-sketch';

class OIFileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawings: [],
      saving: false,
      imageTypes: ["jpg", "png", "gif", "jpeg"],
      currentFile: false
    };
  }
  async componentDidMount() {
    if (this.props.image != "") {
      this.setState({ saving: true });

      let loadedFile = await formService.getObjectFromS3(this.props.image);
      let type = loadedFile.split(".").pop().split("?")[0];
      this.setState({ image: loadedFile, saving: false, type: type });
    }
  }
  async shouldComponentUpdate(props, state) {
    if (props.image != this.props.image) {
      if (props.image != "") {
        this.setState({ saving: true });

        let loadedFile = await formService.getObjectFromS3(props.image);
        let type = loadedFile.split(".").pop().split("?")[0];
        this.setState({ image: loadedFile, saving: false, type: type });
      }
      return true;
    }
    return false;
  }

  _save = async (file) => {
    this.setState({ saving: true });

    let type = file.name.split(".").pop();
    let name = this.props.id + "/" + uuid() + "." + type;

    let myfilekey = await formService.uploadFileToS3(file, name);
    this.props.done(name);
    this.setState({ saving: false });
  };
  showImage() {
    if (this.state.imageTypes.includes(this.state.type)) {
      return (
        <a href={this.state.image} target="blank">
          <img src={this.state.image || ""} width="100px" alt="" />
        </a>
      );
    } else {
      return (
        <a
          style={{ width: "100px", maxWidth: "300px" }}
          href={this.state.image}
          target="blank"
        >
          <FileIcon
            extension={this.state.type}
            {...defaultStyles[this.state.type]}
            style={{ width: "100px", maxWidth: "300px" }}
          />
        </a>
      );
    }
  }
  edit() {
    if (this.props.image != this.props.initial) {
      // alert('clear')
      formService.removeObjectFroms3(this.props.image);
    }
    this.setState({ image: false });
    this.props.done("");
  }
  render() {
    let { controlledValue } = this.state;
    return (
      <div style={this.props.containerStyle}>
        {this.props.hideHead != true && (
          <div
            style={{ width: "300px" }}
            className="p-2 bg-warning text-light mx-auto d-flex "
          >
            {this.props.image == "" ? null : (
              <button
                className="btn btn-primary btn-rounded mr-1"
                onClick={(e) => {
                  e.preventDefault();
                  this.edit();
                }}
              >
                <FontAwesomeIcon icon={faEdit} />{" "}
              </button>
            )}
          </div>
        )}
        <div
          style={{ overflow: "hidden", width: "300px" }}
          className=" mx-auto border border-primary border-1 text-center"
        >
          {this.props.image == "" && this.props.hideHead != true ? (
            <div
              style={{
                overflow: "hidden",
                width: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <input
                type="file"
                onChange={(event) => this._save(event.currentTarget.files[0])}
                className="form-control"
              />
            </div>
          ) : (
            <div
              style={{
                overflow: "hidden",
                width: "300px",
                height: "150px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {this.state.saving ? (
                <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
              ) : (
                this.showImage()
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default OIFileUpload;
