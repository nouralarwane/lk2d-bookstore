import axios from "axios";
import React, { useState, useEffect, useContext, createContext } from "react";
import { AuthContext } from "../AuthProvider";

const panierContext = createContext();
 

const Panier = ({ children }) => {
  const [panier, setpanier] = useState([]);
  const { IsLoggedIn, setIsLoggedIn, User, Profile, image } =
    useContext(AuthContext);


  const getPanier = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/panier/");
      // console.log("Success panier getting: ", response.data);
      const userLivres = response.data.filter(
        (livre) => livre.user === User.id
      );

      setpanier(userLivres);
    } catch (error) {
      console.log("Erreur d'obtention du panier: ", error);
    }
  };

  useEffect(() => {
    getPanier();
  }, [User]);

  return (
    <>
      <div className="container text-light">
        <panierContext.Provider value={{ panier, setpanier }}>
          {children}
        </panierContext.Provider>
      </div>
    </>
  );
};

export default Panier;
export { panierContext };
