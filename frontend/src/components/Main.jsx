import React, { useState, useEffect, useContext } from "react";
import Button from "./Button";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider";
import { panierContext } from "./Panier";

const Main = () => {
  const [Livres, setLivres] = useState([]);
  const [buttonNext, setbuttonNext] = useState(false);
  const [buttonPrevious, setbuttonPrevious] = useState(false);
  const [search, setsearch] = useState("");
  const { IsLoggedIn, setIsLoggedIn, User } = useContext(AuthContext);
  const [addingBook, setAddingBook] = useState(null);
  const { panier, setpanier } = useContext(panierContext);
  const [panierBooks, setpanierBooks] = useState([]);
  const [action, setaction] = useState("");

  // Fetching the first page Books
  const fecthData = async (link) => {
    try {
      const response = await axios.get(link);
      setLivres(response.data);
      // console.log("Livres reçus :", response.data);
    } catch (error) {
      console.error("Erreur de fetching livres: " + error);
    }
  };

  // Going to next
  const goNext = () => {
    fecthData(Livres["next"]);
    setbuttonNext(false);
  };

  // Going to the previous page
  const goPrevious = () => {
    fecthData(Livres["previous"]);
    setbuttonPrevious(false);
  };

  // Search book function

  const searchBook = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/books/?title=${search}&auteur=`,
      );
      setLivres(response.data);
      // console.log(search);
      // console.log("La recherche donne: ", response.data);

      if (response.data["results"].length === 0) {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/books/?title=&auteur=${search}`,
        );
        // console.log(response.data);
        // setLivres(response.data);
      }
    } catch (error) {
      console.log("Erreur: ", error);
    }
  };

  // Get a book

  // const getBook = async (index) => {
  //     try {
  //         const response = await axios.get(`http://127.0.0.1:8000/api/books/${index}`)
  //         return response.data
  //     } catch (error) {
  //         console.error("Erreur de get: ", error);
  //     }
  // }

  // Add to cart function

  const addToCart = async (book) => {
    // console.log("Le livre à ajouter est: ", book);
    // console.log("User est: ", User);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/panier/", {
        user: User["id"],
        book: book["id"],
      });
      setpanier((prev) => [...prev, response.data]);

      setpanierBooks((prev) => [...prev, book]);

      fecthData();
      // console.log("Response de l'ajout: ", response.data);
    } catch (error) {
      console.error("Erreur: ", error);
    }
  };

  // Les livres déjà dans le panier de l'utilisateur

  const userPanier = async () => {
    try {
      const response = await Promise.all(
        panier.map(async (livre) => {
          const res = await axios.get(
            `http://127.0.0.1:8000/api/books/${livre.book}`,
          );
          return res.data;
        }),
      );

      setpanierBooks(response);
      // console.log("Les livres de mon panier sont: ", response);
    } catch (error) {
      console.error("Erreur des livres du panier", error);
    }
  };

  useEffect(() => {
    fecthData("http://127.0.0.1:8000/api/books");
    userPanier();
  }, [panier, User]);

  return (
    <>
      <div className="container">
        <div className="row p-5 text-center text-light bg-light-dark ">
          <h1 className="text-light">Bienvenue amoureux(se) des livres😉</h1>
          <form onSubmit={searchBook} className="row justify-content-center">
            <div className="col-4 mb-4 d-flex  ">
              <input
                type="text"
                name="input"
                maxLength={30}
                onChange={(e) => setsearch(e.target.value.replace(" ", "+"))}
                className="form-control"
                placeholder="Search a book"
              />
              &nbsp;
              <button type="submit" className="btn btn-info">
                Search
              </button>
            </div>
          </form>
          <div className="text-light ">
            <ul className="d-flex justify-evenly  ">
              {Livres["results"]?.map((livre, index) => {
                const estEmprunte =
                  IsLoggedIn &&
                  panierBooks?.some((book) => book.id === livre.id);
                return (
                  <li className="col-2" key={index}>
                    <Link
                      className="h-10 w-10 overflow-hidden"
                      to={`details/${livre.id}`}
                    >
                      <img
                        className=" w-full object-contain"
                        src={livre.image}
                        // width={100}
                        // height={60}
                        alt=""
                      />
                    </Link>
                    <div>{livre.title}</div>

                    {!estEmprunte && IsLoggedIn && (
                      <button
                        onClick={() => addToCart(livre)}
                        className="add btn btn-success"
                      >
                        Ajouter au panier
                      </button>
                    )}

                    {estEmprunte && IsLoggedIn && (
                      <Button
                        text="Accéder au panier"
                        class="btn-primary"
                        url="/profile"
                      />
                    )}
                  </li>
                );
              })}
            </ul>
            {Livres["next"] !== null ? (
              <button onClick={goNext} className="btn btn-primary m-1">
                Next⏩
              </button>
            ) : (
              ""
            )}
            &nbsp;
            {Livres["previous"] !== null ? (
              <button onClick={goPrevious} className="btn btn-info m-4">
                ⏮️Previous
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
