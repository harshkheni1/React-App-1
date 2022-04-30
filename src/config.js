module.exports = {
    apiUrl:
      process.env.NODE_ENV === "development"
        ? "http://127.0.0.1:4001"
        : "http://127.0.0.1:4001",
    getAllCountries:
      "https://restcountries.eu/rest/v2/all?fields=name;languages;callingCodes"
  };