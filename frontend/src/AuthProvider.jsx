import React, { useState, useEffect, useContext, createContext } from "react";
import axiosInstance from "./axiosInstance";
import axios from "axios";

// Create the context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [IsLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken")
  );
 
  const [User, setUser] = useState([]);

  const [Livres, setLivres] = useState([]);

  const [UserLivres, setUserLivres] = useState([]);

  const [Profile, setProfile] = useState([]);

  const accessToken = localStorage.getItem("accessToken");

  const fecthData = async () => {
    try {
      const response = await axiosInstance.get("/protected");

      console.log("Success: ", response.data);
      setUser(response.data["user_infos"]);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  // Recuperer le profile de l'utilisateur

  const getProfile = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/profile/");
      const userProfile = response.data.filter(
        (profile) => profile.user == User.id
      );
      setProfile(userProfile);
    } catch (error) {
      console.log("Erreur d'obtention du profil: ", error);
    }
  };

  // Récuperer les livres
  const getUserData = async () => {
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

  // Créer des notifications

   const createNotification = async () => {
    const currentDate = new Date().toISOString().split("T")[0];

    Livres.map(async (livre, index) => {
      if (livre["date_retour"] <= currentDate) {
        try {
          const livreToreturn = UserLivres.filter(
            (Book) => Book["id"] == livre["book"]
          );
          // console.log("Livres user", livre);

          console.log("The book is: ", livreToreturn);
          const messages =
            `La date de retour est dépassé, veuillez ramener le livre  `.concat(
              livreToreturn["title"]
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
          console.error("Erreur de creation de notification: ", error);
        }
      }
    });
  };

  useEffect(() => {
    fecthData();
  }, []);

  useEffect(() => {
    if (User) {
      getProfile();
      // createNotification()
    }
  }, [User]);

  useEffect(() => {
    if (User && Livres.length > 0 && UserLivres.length > 0) {
      createNotification();
    }
  }, [User, Livres, UserLivres]);

 

  return (
    <AuthContext.Provider
      value={{
        IsLoggedIn,
        setIsLoggedIn,
        User,
        setUser,
        Profile,
        setProfile,
        Livres,
        setLivres,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export { AuthContext };
