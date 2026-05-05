import React, { useState, useEffect, useContext } from "react";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../AuthProvider";

const DetailsBook = () => {
  const [Livres, setLivres] = useState({});
  const [Auteur, setAuteur] = useState(null);
  const { IsLoggedIn } = useContext(AuthContext);

  const urlParam = useParams();
  const id = urlParam["pk"];

  // Fetching the Book
  const fecthData = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/books/${id}/`
      );
      setLivres(response.data);
      //  console.log("Livres reçus :", response.data);
      const idAuteur = response.data["auteur"];
      const bookAuteur = await axios.get(
        `http://127.0.0.1:8000/api/auteur/${idAuteur}/`
      );
      setAuteur(bookAuteur.data);
      // console.log("Auteur : ", bookAuteur.data["nom"]);
    } catch (error) {
      console.error("Erreur: " + error);
    }
  };

  useEffect(() => {
    fecthData();
  }, []);

  return (
    <>
      <div className="container">
        <div className="row  text-light">
          <div className="col-md-6 d-flex justify-between">
            <div>
              <img src={Livres["image"]} width={200} height={300} alt="" />
            </div>
            <div className="mt-15">
              {/* <p>{Auteur["nom"]} </p> */}
              <p>Price: {Livres["price"]} dhs😉</p>
              <p>Quantity: {Livres["quantity"]}</p>
              {IsLoggedIn ? (
                <button className="btn btn-success">Ajouter au panier</button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className="text-center text-xl text-light fw-bold">
          {Livres["details"]}
        </div>
      </div>
    </>
  );
};

export default DetailsBook;
