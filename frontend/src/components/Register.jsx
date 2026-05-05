import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Navigate, useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [errors, seterrors] = useState({});
  const [success, setsuccess] = useState(false);
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userData = {
      username,
      email,
      password,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register/",
        userData
      );
      console.log("response.data == ", response.data);
      console.log("Successful");
      seterrors({});
      setsuccess(true);
      
    } catch (error) {
      console.error("Error: ", error.response.data);
      seterrors(error.response.data);
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <>
      <div className="container">
        <div className="row justify-content-center ">
          <div className="col-md-6 bg-light-dark rounded-xl">
            <h3 className="text-light text-center mb-3">Create an Account</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control mb-3"
                  value={username}
                  onChange={(e) => setusername(e.target.value)}
                  placeholder="Enter username"
                />

                <small>
                  {errors.username && (
                    <div className="text-danger">{errors.username}</div>
                  )}
                </small>
              </div>

              <div className="mb-3">
                <input
                  type="email"
                  className="form-control mb-3"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  placeholder="Enter email"
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

                <small>
                  {errors.password && (
                    <div className="text-danger">{errors.password}</div>
                  )}
                </small>
              </div>

              {success && (
                <div className="alert alert-success">
                  Registration Successful
                </div>
              )}

              {Loading ? (
                <button
                  type="submit"
                  className="btn btn-success d-block mx-auto"
                  disabled
                >
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Please Wait...
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-success d-block mx-auto"
                >
                  Register
                </button>
              )} 
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
