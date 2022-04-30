import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import slugify from "slugify";
import { uuid } from "uuidv4";
import { formService } from "../_services/form.service";
export function CustomDropZone(props) {
  const { isEdit, fileList, onChange } = props;
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        save(file);
      });
    }
  });

  const showfiles = fileList.map((file, index) => (
    <li
      key={index}
      onClick={(e) => {
        openFile(file.key);
      }}
      className="cursor-pointer"
    >
      {file.name}
    </li>
  ));

  const save = async (file) => {
    let type = file.name.split(".").pop();
    let name = "rfp/" + uuid() + "." + type;

    let myfilekey = await formService.uploadFileToS3(file, name);
    if (myfilekey) {
      let uploadedFiles = fileList;
      uploadedFiles.push({ name: file.name, key: name });
      onChange(uploadedFiles);
    }
  };

  const remove = () => {
    formService.removeObjectFroms3(this.props.image);
  };

  const openFile = async (key) => {
    let loadedFile = await formService.getObjectFromS3(key);
    window.open(loadedFile, "_blank");
  };

  return (
    <div className="dropzone-container">
      {isEdit && (
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
      )}
      <div className="mt-2">
        <h4>Files Uploaded</h4>
        <ul>{showfiles}</ul>
      </div>
    </div>
  );
}
