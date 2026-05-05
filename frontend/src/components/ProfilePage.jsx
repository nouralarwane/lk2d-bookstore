import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../axiosInstance";
import { AuthContext } from "../AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import UpdateProfile from "./UpdateProfile";
import InfosUpdate from "./InfosUpdate";
import Button from "./Button";
import Emprunt from "./Emprunt";
import Panier from "./Panier";
// import { getPanier } from "./Panier";
import Notification from "./Notification";

const ProfilePage = () => {
  const { IsLoggedIn, setIsLoggedIn, User, Profile, image } =
    useContext(AuthContext);
  const [Livres, setLivres] = useState([]);
  const [userCart, setuserCart] = useState([]);
  const navigate = useNavigate();
  const [Clicked, setClicked] = useState(false);
  const [Button, setButton] = useState("Emprunter");

  const [idLivre, setidLivre] = useState(null);

  const [Action, setAction] = useState("");

  // Modification de la photo
  const changeProfil = async () => {
    setAction("Profile");
  };

  // Modification des infos

  const changeInfos = async () => {
    setAction("Infos");
  };

  // Voir les notifications

  const seeMessages = async () => {
    setAction("notifications");
  };

  return (
    <>
      <header className="text-light d-flex justify-content-center ">
        <button onClick={changeProfil} className="btn btn-info ">
          Modifier mes infos
        </button>
        &nbsp; &nbsp; &nbsp;
        <button onClick={changeInfos} className="btn btn-primary">
          Changer mon profil
        </button>
        &nbsp; &nbsp; &nbsp;
        <button onClick={seeMessages} className="btn btn-warning">
          Notifications
        </button>
      </header>
      <div className="text-light container text-center mt-3 ">
        <h3 className="fw-bold">
          Welcome to your profile dear {User.username}😇
        </h3>
      </div>
      {/* Modification des infos personnelles */}
      {Action == "Profile" && <UpdateProfile />}

      {/* Modification du profil */}

      {Action == "Infos" && <InfosUpdate />}

      {/* Affichage des emprunts */}

      {Action == "" && (
        <>
          <Emprunt />
        </>
      )}

      {/* Affichage des notifications */}

      {Action == "notifications" && (
        <>
          <Notification />
        </>
      )}
    </>
  );
};

export default ProfilePage;
