import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthProvider";
import { useNavigate } from "react-router-dom";
import { panierContext } from "./Panier";
import Button from "./Button";

const Emprunt = () => {
  const [Livres, setLivres] = useState([]);
  const [UserLivres, setUserLivres] = useState([]);
  const { IsLoggedIn, setIsLoggedIn, User } = useContext(AuthContext);
  const { panier, setpanier } = useContext(panierContext);
  const [panierBooks, setpanierBooks] = useState([]);

  // Récuperer les livres
  const fecthData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/emprunt/");
      const Livres = response.data.filter(
        (livre) => livre["user"] === User["id"]
      );
      setLivres(Livres);

      const books = await Promise.all(
        Livres.map(async (livre) => {
          const res = await axios.get(
            `http://127.0.0.1:8000/api/books/${livre.book}`
          );
          return res.data;
        })
      );

      setUserLivres(books);
    } catch (error) {
      console.error("Erreur emprunts: ", error);
    }
  };

 
  // Les livres du panier

  const getPanierBooks = async () => {
    try {
      const response = await Promise.all(
        panier.map(async (livre) => {
          const res = await axios.get(
            `http://127.0.0.1:8000/api/books/${livre.book}`
          );
          return res.data;
        })
      );

      setpanierBooks(response);
    } catch (error) {
      console.error("Erreur des livres du panier", error);
    }
  };

  // Les emprunts du user

  // Supprimer un panier

  const deleteCart = async (id) => {
    if (confirm("Enlevez le livre de votre profil ?")) {
      const panierDeleted = panier.filter((livre) => livre.book == id);
      console.log("Panier: ", panierDeleted);
      try {
        const deleting = await axios.delete(
          `http://127.0.0.1:8000/api/panier/${panierDeleted[0].id}/`
        );
        setpanier((prev) => prev.filter((livre) => livre.book !== id));
        //  getPanierBooks()
        fecthData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Ajouter à la liste des emprunts

  const borrow = async (id) => {
    if (confirm("Voulez-vous emprunter ce livre ?")) {

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/emprunt/",
          {
            user: User.id,
            book: id,
          }
        );

      } catch (error) {
        console.error("Erreur d'emprunt!!!", error);
      } finally {
        const panierDeleted = panier.filter((livre) => livre.book == id);
        const deleting = await axios.delete(
          `http://127.0.0.1:8000/api/panier/${panierDeleted[0].id}/`
        );
        setpanier((prev) => prev.filter((livre) => livre.book !== id));
        getPanierBooks();
        // fecthData();
      }
    }
  };

  // Remettre un livre

  const giveBack = async (id) => {
    const livretoGive = Livres.filter((livre) => livre.book == id);
    console.log("Le rendu est: ", livretoGive[0]);

    if (confirm("Vous voulez remettre le livre ? ")) {
      try {
        const response = await axios.delete(
          `http://127.0.0.1:8000/api/emprunt/${livretoGive[0].id}/`
        );
        fecthData();
      } catch (error) {
        console.error("Erreur de remise du livre: ", error);
      }

      fecthData();
    }
  };

  useEffect(() => {
    fecthData();
    getPanierBooks();
  }, [panier, User]);

  return (
    <>
      <div className="container">
        <div className="row text-light text-center">
          <div className="h2 m-3">Vos préferences</div>
          <table>
            <thead>
              <tr>
                <th>Livres</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {panierBooks?.map((livre, index) => (
                <tr key={livre.id} className="">
                  <td className="fw-bold fst-italic mt-3">{livre["title"]}</td>
                  <td
                    onClick={() => deleteCart(livre["id"])}
                    className="btn btn-danger"
                  >
                    Supprimer
                  </td>
                  <td
                    onClick={() => borrow(livre["id"])}
                    className="btn btn-success m-2.5"
                  >
                    Emprunter
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <hr />
      <div className="container">
        <div className="row text-light text-center">
          <div className="h2 m-3">Vos emprunts</div>
          <table className="">
            <thead>
              <tr>
                <th scope="col">Livres</th>
                {/* <th scope="col">Actions</th> */}
                <th scope="col">Date Retour</th>
              </tr>
            </thead>

            <tbody>
              {UserLivres.map((livre, index) => {
                const livreRetour = Livres.filter(
                  (Book) => Book.book === livre.id
                );
                return (
                  <tr key={livre.id} className="">
                    <td className="fw-bold fst-italic mt-3 ">
                      {livre["title"]}
                    </td>
                    {/* <td
                      onClick={() => giveBack(livre["id"])}
                      className="btn btn-info mt-3"
                    >
                      Remettre le livre
                    </td> */}
                    <td className="fw-bold fst-italic ">
                      {livreRetour[0]["date_retour"]}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Emprunt;
