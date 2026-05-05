import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../axiosInstance";
import { AuthContext } from "../AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const PageTest = () => {
  const { IsLoggedIn, setIsLoggedIn, User } = useContext(AuthContext);
  const [Livres, setLivres] = useState([]);
  const [userCart, setuserCart] = useState([]);
  const navigate = useNavigate();
  const [Clicked, setClicked] = useState(false);
  const [Button, setButton] = useState("Emprunter");

  const [idLivre, setidLivre] = useState(null);

  // Avoir le panier
  const fecthData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/books/");
      const userCart = response.data.filter(
        (livre) => livre["user"] === User["id"]
      );
      setLivres(userCart);

      const books = await Promise.all(
        userCart.map(async (livre) => {
          const res = await axios.get(
            `http://127.0.0.1:8000/api/books/${livre.book}`
          );
          return res.data;
        })
      );

      setuserCart(books);
    } catch (error) {
      console.error("Erreur: ", error);
    }
  };

  useEffect(() => {
    if (User && User.id) {
      fecthData();
    }
  }, [User]);

  const handleClick = async (livre) => {
    if (!Clicked) {
      document.getElementsByClassName("boutton").disabled = true;
      setClicked(true);
      setidLivre(livre["id"]);
      console.log("Livre: ", livre);
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/emprunt/",
          {
            book: livre["id"],
            user: User["id"],
          }
        );
        console.log("Response: ", response.data);
      } catch (error) {
        console.error("Erreur: ", error);
      }
    } else {
      setClicked(false);
    }
  };

  return (
    <>
      <div className="text-light container ">
        {IsLoggedIn ? (
          <div>
            <h3 className="fw-bold">
              Welcome to your profile dear {User.username}😇
            </h3>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="container text-light">
        <div className="row">
          <h3>Your Cart</h3>
          <ul>
            {userCart.map((livre) => (
              <li>
                <div className="m-3 d-flex justify-around ">
                  <Link to={`/details/${livre["id"]}`}>
                    <img src={livre["image"]} width={150} height={100} alt="" />
                  </Link>
                  <div className="align-items-center mt-40">
                    <p>{livre["price"]} dhs</p>

                    {livre["id"] === idLivre && Clicked ? (
                      <button
                        key={livre["id"]}
                        onClick={() => handleClick(livre)}
                        className="btn bg-danger boutton"
                      >
                        Emprunté{" "}
                      </button>
                    ) : (
                      <button
                        key={livre["id"]}
                        onClick={() => handleClick(livre)}
                        className="btn btn-success"
                      >
                        Emprunter{" "}
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default PageTest;
