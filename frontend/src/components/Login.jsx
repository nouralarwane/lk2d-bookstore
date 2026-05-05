import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider";

const Login = () => {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [errors, seterrors] = useState("");
  const [Loading, setLoading] = useState(false);
  const { IsLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userData = { username, password };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/token/",
        userData
      );
      console.log(response.data);
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      await new Promise((resolve) => setTimeout(resolve, 10));
      setIsLoggedIn(true);
      navigate("/");
      window.location.reload();
    } catch (error) {
      seterrors("Mauvais identifiants!!");
    } finally {
      setLoading(false);
    }
  }; 

  return (
    <>
      <div className="container">
        <div className="row justify-content-center ">
          <div className="col-md-6 bg-light-dark rounded-xl">
            <h3 className="text-light text-center mb-3">Logging </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control mb-3"
                  value={username}
                  onChange={(e) => setusername(e.target.value)}
                  placeholder="Enter username"
                />
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  className="form-control mb-3"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  placeholder="Enter password"
                />

                {errors && <div className="text-danger">{errors}</div>}
              </div>

              {Loading ? (
                <button
                  type="submit"
                  className="btn btn-success d-block mx-auto"
                  disabled
                >
                  Logging in...
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-success d-block mx-auto"
                >
                  Log in
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
