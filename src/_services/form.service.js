import config from "../config";
import { authHeader, handleResponse } from "../_helpers";
import { encData, removeAllDotsButLast } from "../_helpers/_helperFunctions";
import axios from "axios";
import slugify from "slugify";
export const formService = {
  getObjectFromS3,
  getSignedUrl,
  removeObjectFroms3,
  uploadFileToS3,
  uploadBlobToS3,
  saveMutualNDA,
  getMutualNDAProfileById,
  saveArrowPartnerShipAgreement,
  getArrowAgreementProfileById,
  getRFPProfileById,
  saveRPFProfile,
  getCadFilesFromS3,
  recordCadFilesDownload,
  getObjectFromS3NoAuth
};

function getObjectFromS3(data) {
  const requestOptions = {
    method: "POST",
    headers: authHeader(),
    body: encData({ key: data })
  };
  return fetch(`${config.apiUrl}/api/v1/forms/getObjectFromS3`, requestOptions)
    .then(handleResponse)
    .then((data) => {
      return data.Data.url;
    });
}

function getCadFilesFromS3() {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };
  return fetch(
    `${config.apiUrl}/api/v1/forms/getCadFileFromS3`,
    requestOptions
  ).then(handleResponse);
}

function getSignedUrl(data) {
  const requestOptions = {
    method: "POST",
    headers: authHeader(),
    body: encData(data)
  };
  return fetch(
    `${config.apiUrl}/api/v1/forms/getSignedUrl`,
    requestOptions
  ).then(handleResponse);
}

function removeObjectFroms3(data) {
  const requestOptions = {
    method: "POST",
    headers: authHeader(),
    body: encData({ key: data })
  };
  return fetch(
    `${config.apiUrl}/api/v1/forms/removeObjectFroms3`,
    requestOptions
  ).then(handleResponse);
}

function uploadFileToS3(file, s3FilePath, progessCallback) {
  // Split the filename to get the name and type
  let originalname = file.name.toLowerCase();
  let fileName = s3FilePath; //+ removeAllDotsButLast(slugify(originalname, { lower: true }));
  //let fileName = "file-upload-test/" + this.state.selectedFiles[0].name;

  let fileType = file.type;

  return new Promise((resolve, reject) => {
    axios
      .post(
        `${config.apiUrl}/api/v1/forms/getSignedUrl`,
        {
          fileName: fileName,
          fileType: fileType
        },
        {
          headers: authHeader()
        }
      )
      .then((response) => {
        var returnData = response.data.Data;
        var signedRequest = returnData.signedRequest;
        var url = returnData.url;

        // Put the fileType in the headers for the upload
        var options = {
          headers: {
            "Content-Type": fileType
          },
          onUploadProgress: (ev) => {
            if (progessCallback) {
              progessCallback(ev);
            }
          }
        };
        axios
          .put(signedRequest, file, options)
          .then((data) => {
            resolve(url);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}

function uploadBlobToS3(file, s3FilePath, mime, progessCallback) {
  // Split the filename to get the name and type
  let fileName = s3FilePath;
  //let fileName = "file-upload-test/" + this.state.selectedFiles[0].name;
  //   let formData = new FormData();
  //   formData.append("data", file);
  let fileType = mime;

  return new Promise((resolve, reject) => {
    axios
      .post(
        `${config.apiUrl}/api/v1/forms/getSignedUrl`,
        {
          fileName: fileName,
          fileType: fileType
        },
        {
          headers: authHeader()
        }
      )
      .then((response) => {
        var returnData = response.data.Data;
        var signedRequest = returnData.signedRequest;
        var url = returnData.url;

        // Put the fileType in the headers for the upload
        var options = {
          headers: {
            "Content-Type": fileType
          },
          onUploadProgress: (ev) => {
            if (progessCallback) {
              progessCallback(ev);
            }
          }
        };
        axios({
          url: signedRequest,
          method: "PUT",
          options,
          data: file
        })
          //.put(signedRequest, file, options)

          .then((data) => {
            resolve(url);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}

function saveMutualNDA(data) {
  const requestOptions = {
    method: "POST",
    headers: authHeader(),
    body: encData(data)
  };
  return fetch(`${config.apiUrl}/api/v1/forms/nda`, requestOptions).then(
    handleResponse
  );
}

function getMutualNDAProfileById(id) {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };
  return fetch(
    `${config.apiUrl}/api/v1/forms/mutualnda/${id}`,
    requestOptions
  ).then(handleResponse);
}

function saveArrowPartnerShipAgreement(data) {
  const requestOptions = {
    method: "POST",
    headers: authHeader(),
    body: encData(data)
  };
  return fetch(
    `${config.apiUrl}/api/v1/forms/arrowpatnerhsipagreement`,
    requestOptions
  ).then(handleResponse);
}

function getArrowAgreementProfileById(id) {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };
  return fetch(
    `${config.apiUrl}/api/v1/forms/arrowagreement/${id}`,
    requestOptions
  ).then(handleResponse);
}

function getRFPProfileById(id) {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };
  return fetch(`${config.apiUrl}/api/v1/forms/rfp/${id}`, requestOptions).then(
    handleResponse
  );
}

function saveRPFProfile(data) {
  const requestOptions = {
    method: "POST",
    headers: authHeader(),
    body: encData(data)
  };
  return fetch(`${config.apiUrl}/api/v1/forms/rfp`, requestOptions).then(
    handleResponse
  );
}

function recordCadFilesDownload(id) {
  const requestOptions = {
    method: "POST",
    headers: authHeader()
  };
  return fetch(
    `${config.apiUrl}/api/v1/forms/recordCadFilesDownload/${id}`,
    requestOptions
  ).then(handleResponse);
}

function getObjectFromS3NoAuth(data) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": `application/json` },
    body: encData({ key: data })
  };
  return fetch(
    `${config.apiUrl}/api/v1/forms/getObjectFromS3NoAuth`,
    requestOptions
  )
    .then(handleResponse)
    .then((data) => {
      return data.Data.url;
    });
}
