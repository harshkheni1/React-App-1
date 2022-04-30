import React, { Component } from "react";
import moment from "moment";
import { uuid } from "uuidv4";
import { formService } from "../_services";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo, faSave, faEdit } from "@fortawesome/free-solid-svg-icons";
import CanvasDraw from "react-canvas-draw";

class OImageCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawings: [],
      saving: false,
      imageUrl: ""
    };
  }
  async componentDidMount() {
    if (this.props.image != "") {
      this.setState({ saving: true });

      let loadedFile = await formService.getObjectFromS3(this.props.image);
      this.setState({ image: loadedFile, saving: false });
    }
  }
  async shouldComponentUpdate(props, state) {
    if (props.image != this.props.image) {
      if (props.image != "") {
        this.setState({ saving: true });

        let loadedFile = await formService.getObjectFromS3(props.image);
        this.setState({ image: loadedFile, saving: false });
      }
      return true;
    }
    return false;
  }

  _undo = () => {
    this._sketch.undo();
  };

  _clear = () => {
    this._sketch.clear();
  };
  _save = async () => {
    let myID = "";
    if (this.props.myID) {
      myID = this.props.myID;
    }
    let a = document.getElementById("unique" + myID);
    let b = a.childNodes[0];
    let c = b.childNodes[1];
    let dataUrl = c.toDataURL();
    this.setState({ saving: true });
    let fileName = uuid() + "." + "png";
    let name = this.props.id + "/" + fileName;
    let file = "";
    let arr = dataUrl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    file = new Blob([u8arr], { type: mime });
    let myfilekey = await formService.uploadBlobToS3(file, name, mime);

    this.props.done(name);
    this.setState({ saving: false });
  };

  edit() {
    if (this.props.image != this.props.initial) {
      alert("clear");
      formService.removeObjectFroms3(this.props.image);
    }
    this.setState({ image: false });
    this.props.done("");
  }

  render() {
    let { controlledValue } = this.state;
    return (
      <div>
        {this.props.hideHead != true && (
          <div
            style={{ width: "300px" }}
            className="p-2 bg-warning text-light mx-auto d-flex "
          >
            {this.props.image == "" ? (
              <>
                <button
                  className="btn btn-primary btn-rounded mr-1"
                  onClick={(e) => {
                    e.preventDefault();
                    this._undo();
                  }}
                >
                  <FontAwesomeIcon icon={faUndo} />{" "}
                </button>
                {/* <button className="btn btn-primary btn-rounded mr-1" onClick={(e)=>{e.preventDefault();this._redo()}}><i className="fa fa-redo"></i> </button> */}
                <button
                  className="btn btn-primary btn-rounded mr-1"
                  onClick={(e) => {
                    e.preventDefault();
                    this._save();
                  }}
                >
                  {this.state.saving ? (
                    <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                  ) : (
                    <FontAwesomeIcon icon={faSave} />
                  )}
                </button>
              </>
            ) : (
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
          className="mx-auto border border-primary border-1 text-center"
        >
          {this.props.image == "" && this.props.hideHead != true ? (
            <div
              id={"unique" + (this.props.myID ? this.props.myID : "")}
              style={{ overflow: "hidden", width: "300px" }}
            >
              <CanvasDraw
                width="300px"
                ref={(c) => (this._sketch = c)}
                brushColor={"black"}
                brushRadius={2}
                lazyRadius={2}
                canvasWidth={300}
                canvasHeight={150}
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
                <img src={this.state.image || ""} width="100%" alt="" />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default OImageCanvas;
