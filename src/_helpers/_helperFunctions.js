import EncDec from "../e2e/e2e_functions/index";
import { AUDIO_FILES, VIDEO_FILES, IMAGE_TYPES, DOCS_FILES } from "./common";
export const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const isEmpty = (value) => {
  return (
    value == null || // From standard.js: Always use === - but obj == null is allowed to check null || undefined
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};

export const encData = function (data, encrypt) {
  let isenc = encrypt
    ? 1
    : localStorage.getItem("isenc")
    ? parseInt(localStorage.getItem("isenc"))
    : 0;
  if (isenc === 1) {
    return JSON.stringify({
      enc_string: EncDec.encryptResponse(JSON.stringify(data))
    });
  } else {
    return JSON.stringify(data);
  }
};

export const capitalizeAndJoin = (data) => {
  let capitalizedWordsList = data.map((elem) => {
    return capitalize(elem);
  });

  return capitalizedWordsList.join(", ");
};

export const isFormCompleted = (formData = {}, noOfFields, name) => {
  if (name === "aboutResources") {
    let mutatedObject = { ...formData };
    for (const [key, value] of Object.entries(mutatedObject)) {
      if (
        key.endsWith("Text") &&
        key !== "employeeAtCurrentLocationText" &&
        key !== "revenueInText"
      ) {
        delete mutatedObject[key];
      }
    }
    formData = { ...mutatedObject };
  }
  let keyList = Object.keys(formData);
  let flag = true;
  if (keyList.length < noOfFields) {
    return false;
  }
  keyList.forEach((key) => {
    if (Array.isArray(formData[key])) {
      if (!formData[key].length) {
        flag = false;
      }
    } else {
      if (!formData[key]) {
        flag = false;
      }
    }
  });
  return flag;
};

export const countProfileCompletionStateByField = (formData = {}) => {
  let fieldWithValue = 0;

  for (const [key, value] of Object.entries(formData)) {
    if (Array.isArray(formData[key]) && formData[key].length > 0) {
      fieldWithValue = fieldWithValue + 1;
    } else if (
      formData[key] !== null &&
      formData[key].toString() &&
      formData[key].length > 0 &&
      key !== "materialsCapabilitesText" &&
      key !== "businessLeadershipText" &&
      key !== "industriesSuppliedText"
    ) {
      fieldWithValue = fieldWithValue + 1;
    }
  }

  return fieldWithValue;
};

export const removeAllDotsButLast = (str) => {
  return str.replace(/[.](?=.*[.])/g, "-");
};

export const getFileExtension = (filename) => {
  return filename.split(".").pop();
};

export const getClickableLink = (link) => {
  return link.startsWith("http://") || link.startsWith("https://")
    ? link
    : `http://${link}`;
};

export const concateAddress = (details = {}) => {
  let addressString = "";

  if (details.address) {
    addressString += `${details.address}, `;
  }
  if (details.city) {
    addressString += `${details.city}, `;
  }

  if (details.province) {
    addressString += `${details.province}, `;
  }

  if (details.country) {
    addressString += `${details.country}, `;
  }

  if (details.postalCode) {
    addressString += `${details.postalCode}`;
  }

  return addressString;
};

export const isObjectEmpty = (givenObject) => {
  if (givenObject) {
    let keys = Object.keys(givenObject);
    return keys.length ? false : true;
  }
  return true;
};

export const getFieldValue = function (obj, path, def) {
  for (var i = 0, path = path.split("."), len = path.length; i < len; i++) {
    if (!obj[path[i]]) return def;
    obj = obj[path[i]];
  }
  return obj;
};

export const getUniqueKeys = function (list) {
  let unique = [];
  let length = list.length;
  for (let i = 0; i < length; i++) {
    let flag = true;
    for (let j = 0; j < length; j++) {
      let list1 = list[i].split(" > ");
      let list2 = list[j].split(" > ");
      if (list[i] === list[j]) {
        continue;
      }
      if (checkAryExistInAry(list1, list2)) {
        flag = false;
      }
    }
    if (flag) {
      unique.push(list[i]);
    }
  }

  return unique;
};

export const checkAryExistInAry = function (array, target) {
  return array.every((i) => target.includes(i));
};

export const getFileType = function (fileExtension) {
  if (AUDIO_FILES.includes(fileExtension)) {
    return "audio";
  } else if (VIDEO_FILES.includes(fileExtension)) {
    return "video";
  } else if (IMAGE_TYPES.includes(fileExtension)) {
    return "image";
  } else if (DOCS_FILES.includes(fileExtension)) {
    return "docs";
  } else {
    return "others";
  }
};

export const formatAddressForGoogle = function (address) {
  return address.toString().replace(/\s+/g, "+");
};

export const sortCompanies = (companies) => {
  let sortedCompanies = companies.sort((a, b) =>
    a.demographics.companyTitle.localeCompare(b.demographics.companyTitle)
  );
  return sortedCompanies;
};

export const updateCityWithCount = (listOfCity, browseByCityList) => {
  let updatedCityWithCounts = [];
  listOfCity.forEach((city) => {
    const matchedCity = browseByCityList.find(
      (browseCity) => browseCity._id === city._id
    );

    matchedCity
      ? updatedCityWithCounts.push(matchedCity)
      : updatedCityWithCounts.push({ _id: city._id, count: 0 });
  });

  return updatedCityWithCounts;
};

export const updateSectorWithCount = (browseBySectorList, listOfSectors) => {
  let updatedSectorsWithCounts = [];
  let tempbrowseBySectorList = browseBySectorList;
  //filtering sector and adding with counts
  listOfSectors.forEach((sector) => {
    const matchedSector = browseBySectorList.find(
      (browserSector) => browserSector._id === sector.sectorName
    );

    if (!matchedSector) {
      tempbrowseBySectorList.push({ _id: sector.sectorName, count: 0 });
    }
  });

  const finalArrayForSectors = tempbrowseBySectorList.filter(
    (sectors) => !sectors._id.startsWith("Advanced manufacturing -")
  );

  updatedSectorsWithCounts = finalArrayForSectors;

  let Others = {
    _id: "",
    count: ""
  };
  updatedSectorsWithCounts.forEach((sectors, index) => {
    if (sectors._id.toString() === "Others") {
      Others.count = sectors.count;
      Others._id = sectors._id;
      delete updatedSectorsWithCounts[index];
    }
  });

  // updatedSectorsWithCounts.push(ICT);

  updatedSectorsWithCounts.sort((a, b) => {
    return a._id.localeCompare(b._id);
  });

  updatedSectorsWithCounts.push(Others);
  return updatedSectorsWithCounts;
};

export const sortCompaniesAlpabatecially = (companies) => {
  companies.sort((a, b) => {
    return a.demographics.companyTitle.localeCompare(
      b.demographics.companyTitle
    );
  });
  return companies;
};
