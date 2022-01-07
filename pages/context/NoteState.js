import NoteContext from "./NoteContext";
import { getSessionToken } from "@shopify/app-bridge-utils";
import { useAppBridge } from "@shopify/app-bridge-react";
import React, { useState } from "react";
import axios from "axios";

const NoteState = (props) => {
  const [products, setproducts] = useState([]);
  const app = useAppBridge();
  async function getProducts() {
    const axios_instance = axios.create();
    // Intercept all requests on this Axios instance
    axios_instance.interceptors.request.use(function (config) {
      return getSessionToken(app) // requires a Shopify App Bridge instance
        .then((token) => {
          // Append your request headers with an authenticated token
          config.headers["Authorization"] = `Bearer ${token}`;
          return config;
        });
    });

    const product = await axios_instance.get("/shop");
    //const webhook = await axios_instance.get("/webhook");
    console.log(product);
    setproducts(product.data.body.products);
  }

  async function getProductById(id) {
    const axios_instance = axios.create();
    // Intercept all requests on this Axios instance
    axios_instance.interceptors.request.use(function (config) {
      return getSessionToken(app) // requires a Shopify App Bridge instance
        .then((token) => {
          // Append your request headers with an authenticated token
          config.headers["Authorization"] = `Bearer ${token}`;
          return config;
        });
    });

    const product = await axios_instance.get(`/products/${id}`);
    console.log(product.data);
  }
  async function deleteProductById(id) {
    const axios_instance = axios.create();
    // Intercept all requests on this Axios instance
    axios_instance.interceptors.request.use(function (config) {
      return getSessionToken(app) // requires a Shopify App Bridge instance
        .then((token) => {
          // Append your request headers with an authenticated token
          config.headers["Authorization"] = `Bearer ${token}`;
          return config;
        });
    });

    const product = await axios_instance.delete(`/products/${id}`);
    console.log(product.data);
  }
  return (
    <NoteContext.Provider
      value={{ getProducts, products, getProductById, deleteProductById }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
