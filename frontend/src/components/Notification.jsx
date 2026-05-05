import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../AuthProvider";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { panierContext } from "./Panier";
import axios from "axios";

const Notification = () => {
  const [UserLivres, setUserLivres] = useState([]);
  const { IsLoggedIn, setIsLoggedIn, User, Profile, Livres, setLivres } =
    useContext(AuthContext);

  const { panier, setpanier } = useContext(panierContext);

  const navigate = useNavigate();

  const [Notifications, setNotifications] = useState([]);
  const [userNotifications, setUserNotifications] = useState([]);

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

  // Recuperer les notifications
  const getMessages = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/notification/"
      );
      const messages = response.data.filter(
        (message) => message["user"] === User["id"]
      );
      setUserNotifications(messages);
    } catch (error) {
      console.error("Erreur emprunts: ", error);
    }
  };

  // Créer des notifications

  const createNotification = async () => {
    const today = new Date();
    const currentDate =
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0");

    // console.log(currentDate);
    Livres.forEach(async (livre) => {
      if (livre["date_retour"] <= currentDate) {
        try {
          const livreToreturn = UserLivres.filter(
            (Book) => Book["id"] == livre["book"]
          );
        //   console.log("Livre to return", livreToreturn);

          // console.log("The book is: ", livreToreturn);
          const title = String(livreToreturn[0]["title"]);
          // console.log("title: ", title);
          // console.log("title: ", typeof(title));

          const messages =
            `La date de retour est dépassé, veuillez ramener le livre: `.concat(
              title
            );
          const response = await axios.post(
            "http://127.0.0.1:8000/api/notification/",
            {
              message: messages,
              user: User["id"],
              emprunt: livre["id"],
            }
          );
          console.log("Creation de notification: ", response.data);
        } catch (error) {
          // console.error("Erreur de creation de notification: ", error)
        }
      }
    });
  };

  useEffect(() => {
    fecthData();
    getMessages();
  }, [panier, User]);

  useEffect(() => {
    if (User && Livres.length > 0 && UserLivres.length > 0) {
      createNotification();
    }
  }, [User, Livres, UserLivres]);

//   console.log("Notifications: ", userNotifications);
//   console.log("User Liivres: ", Livres);

  return (
    <>
      <div className="container">
        {userNotifications.map((note, index) => (
          <div className="fst-italic text-2xl mt-4 fw-bold text-danger">
            {index + 1}!!! {note["message"]}🤨
          </div>
        ))}
      </div>
    </>
  );
};

export default Notification;
