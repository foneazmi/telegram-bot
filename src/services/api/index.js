import request from "./wrapper";
import qs from "qs";

const search = (payload) =>
  request({
    url: `v6/finance/autocomplete?${qs.stringify({ lang: "en", ...payload })}`,
    method: "GET",
    type: "yf",
  });

export const api = {
  search,
};
