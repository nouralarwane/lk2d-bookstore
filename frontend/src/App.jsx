import { useState } from "react";
import "./assets/css/style.css";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import DetailsBook from "./components/DetailsBook";
import AuthProvider from "./AuthProvider";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import ProfilePage from "./components/ProfilePage";
import Emprunt from "./components/Emprunt";
import UpdateProfile from "./components/UpdateProfile";
import Panier from "./components/Panier";
import Notification from "./components/Notification";

function App() {
  return (
    <>
      <AuthProvider>
        <Panier>
          <BrowserRouter>
            <Header />
            <Routes>
             <Route path="/" element={<Main />} />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route path="/details/:pk" element={<DetailsBook />} />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/notification"
                element={
                  <PrivateRoute>
                    <Notification />
                  </PrivateRoute>
                }
              />

              <Route
                path="/update"
                element={
                  <PrivateRoute>
                    <UpdateProfile />
                  </PrivateRoute>
                }
              />

              <Route
                path="/emprunt"
                element={
                  <PrivateRoute>
                    <Emprunt />
                  </PrivateRoute>
                }
              />

              {/* <Route
              path="/panier"
              element={
                <PrivateRoute>
                  <Panier />
                  
                </PrivateRoute>
              } 
            /> */}
            </Routes>
            <Footer />
          </BrowserRouter>
        </Panier>
      </AuthProvider>
    </>
  );
}

export default App;
