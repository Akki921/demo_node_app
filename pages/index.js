import { Heading, Page } from "@shopify/polaris";
import React, { useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import NoteContext from "./context/NoteContext";

function Index(props) {
  const context = useContext(NoteContext);
  const { getProducts, products, getProductById, deleteProductById } = context;

  async function handleClick() {
    getProducts();
  }

  console.log(products);
  const editproduct = async (id) => {
    getProductById(id);
  };

  const deleteproduct = async (id) => {
    deleteProductById(id);
  };

  return (
    <>
      <Page>
        <Heading>Shopify app with Node and React </Heading>
        <input value="Update Pages" type="submit" onClick={handleClick}></input>
        <div className="container">
          <div className="row">
            {products !== 0 ? (
              products.map((data) => {
                return (
                  <div className="col-sm-4 mb-4" Key={data.id}>
                    <div
                      className="card "
                      style={{ width: "18rem", height: "100%" }}
                      key={data.id}
                    >
                      <img src="..." className="card-img-top" alt="..." />
                      <div className="card-body">
                        <h5 className="card-title">{data.title}</h5>
                        <p className="card-text">{data.vendor}</p>
                        <div className="d-flex justify-content-between">
                          <button
                            className="btn btn-primary btn-lg"
                            onClick={() => editproduct(data.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-primary btn-lg"
                            onClick={() => deleteproduct(data.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <h1>Data is Loading</h1>
            )}
          </div>
        </div>
      </Page>
      <button
        type="button"
        className="btn btn-primary"
        data-toggle="modal"
        data-target="#exampleModal"
      >
        Launch demo modal
      </button>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Modal title
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">...</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Index;
