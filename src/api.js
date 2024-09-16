import React from "react";
import { cryptoData, cryptoAssets } from "./data.js";

export const fakeFetchCrypto = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(cryptoData);
    }, 500);
  });
};

export const fetchAssets = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(cryptoAssets);
    }, 500);
  });
};
