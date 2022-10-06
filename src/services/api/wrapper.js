import axios from "axios";

const config = {
  yf: {
    baseURL: "https://yfapi.net/",
    headers: {
      "X-API-KEY": "B3m3hP8lhg2BtyUbWaS5i6gR94TPMNnH8xmCcLqj",
    },
  },
};

const request = async (options) => {
  const client = axios.create({
    baseURL: config[options.type].baseURL,
  });
  options.headers = {
    Accept: "application/json",
    ...config[options.type].headers,
  };
  const onSuccess = (e) => {
    return Promise.resolve(e);
  };
  const onError = (e) => {
    return Promise.reject(e);
  };
  return client(options).then(onSuccess).catch(onError);
};

export default request;
