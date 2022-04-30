export const sectorOptions = [
  { value: "Accommodation ", label: "Accommodation " },
  { value: "Food Services ", label: "Food Services " },
  {
    value: "Administrative and Support ",
    label: "Administrative and Support "
  },
  { value: "Waste Management", label: "Waste Management" },
  { value: "Remediation Services", label: "Remediation Services" },
  { value: "Agriculture", label: "Agriculture" },
  { value: "Forestry ", label: "Forestry " },
  { value: "Fishing and Hunting ", label: "Fishing and Hunting " },
  { value: "Arts", label: "Arts" },
  {
    value: "Entertainment and Recreation ",
    label: "Entertainment and Recreation "
  },
  { value: "Construction", label: "Construction" },
  { value: "Educational Services", label: "Educational Services" },
  { value: "Health Care ", label: "Health Care " },
  { value: "Social Assistance", label: "Social Assistance" },
  {
    value: "Information and Cultural Industries",
    label: "Information and Cultural Industries"
  },
  { value: "Manufacturing", label: "Manufacturing" },
  { value: "Mining ", label: "Mining " },
  { value: "Oil and Gas Extraction", label: "Oil and Gas Extraction" },
  { value: "Other Services", label: "Other Services" },
  { value: "Professional Services", label: "Professional Services" },
  {
    value: "Scientific and Technical Services",
    label: "Scientific and Technical Services"
  },
  { value: "Retail Trade", label: "Retail Trade" },
  { value: "Public Administration", label: "Public Administration" },
  { value: "Transportation", label: "Transportation" },
  { value: "Warehousing", label: "Warehousing" },
  { value: "Wholesale Trade", label: "Wholesale Trade" }
];

export const getSectorPreselectedOptions = function (sectorList) {
  if (sectorList) {
    return sectorList.map((sector) => {
      return { value: sector, label: sector };
    });
  }

  return [];
};

export const getOptionForSingleSelect = (sectorData) => {
  if (sectorData !== null && sectorData.length > 0) {
    return { value: sectorData[0], label: sectorData[0] };
  }
  return null;
};

export const IMAGE_TYPES = ["jpg", "jpeg", "png", "svg", "gif", "webp"];
export const AUDIO_FILES = [
  "mp3",
  "wav",
  "ogg",
  "aac",
  "flac",
  "alac",
  "dsd",
  "aiff",
  "m4a",
  "wma"
];
export const VIDEO_FILES = [
  "mp4",
  "wmv",
  "ogv",
  "avi",
  "flv",
  "3gp",
  "mov",
  "webm",
  "3g2",
  "mpg",
  "mkv",
  "m4v",
  "m4a",
  "f4v",
  "f4a",
  "m4b",
  "m4r",
  "f4b",
  "mpeg"
];

export const DOCS_AND_IMAGES = ["png", "jpg", "jpeg", "webp", "svg"];

export const DOCS_FILES = [
  "csv",
  "xls",
  "xlsx",
  "docx",
  "pptx",
  "doc",
  "odp",
  "ppt",
  "DOC"
];

export const IMAGE_OBJECT = {
  "Advanced manufacturing": "/assets/images/Advanced Manufacturing.svg",
  "Information and communication technologies":
    "/assets/images/Information and Communication Technologies.svg",
  "Professional services and back office operations":
    "/assets/images/Professional Services and Back-Office Operations.svg",
  Agribusiness: "/assets/images/Agriculture and Agri-Tech.svg",
  "Health and pharmaceutical": "/assets/images/Life Sciences.svg",
  "Transportation logistics & warehousing":
    "/assets/images/Transportation and logistics.svg",
  Others: "/assets/images/InvestWE_Other.svg",
  "Transportation logistics and warehousing":
    "/assets/images/Transportation and logistics.svg"
};

export const SECTORS_NAME_CHANGE = {
  "Information and communication technologies":
    "Information & communication technologies",
  Other: "Others",
  "Professional services and back office operations":
    "Professional services & back office operations",
  "Health and pharmaceutical": "Health & pharmaceutical",
  "Transportation logistics and warehousing":
    "Transportation logistics & warehousing"
};

export const MUNICIPALITIES_DATA = [
  { label: "Amherstburg", value: "Amherstburg" },
  { label: "Essex", value: "Essex" },
  { label: "Kingsville", value: "Kingsville" },
  { label: "Lakeshore", value: "Lakeshore" },
  { label: "LaSalle", value: "LaSalle" },
  { label: "Leamington", value: "Leamington" },
  { label: "Tecumseh", value: "Tecumseh" },
  { label: "Windsor", value: "Windsor" }
];
