import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../axiosInstance";
import { AuthContext } from "../AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const UpdateProfile = () => {
  const { IsLoggedIn, setIsLoggedIn, User, Profile } = useContext(AuthContext);

  const navigate = useNavigate();
  useEffect(() => {
    console.log(User, Profile);
  }, [User]);

  const [Username, setUsername] = useState(User.username);
  const [Email, setEmail] = useState(User.email);
  const [Password, setPassword] = useState("");

  const [profile, setprofile] = useState(Profile[0]?.profile);
  const [errors, seterrors] = useState({});
  const [success, setsuccess] = useState(false);
  const [Loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const updatedData = { Username, Email };

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/register/${User.id}/`,
        {
          username: Username,
          email: Email,
          password: Password,
        }
      );
      console.log("Successful updating: ", response.data);
      seterrors({});
      setsuccess(true);
      window.location.reload();

      navigate("/profile/");
    } catch (error) {
      console.error("Error: ", error.response.data);
      seterrors(error.response.data);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="text-light container">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control w-25 d-block mx-auto mb-3"
              value={Username}
              onChange={(e) => setUsername(e.target.value)}
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
              className="form-control w-25 d-block mx-auto mb-3"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control w-25 d-block mx-auto mb-3"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>

          {success && (
            <div className="alert alert-success">Updating Successful</div>
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
            <button type="submit" className="btn btn-success d-block mx-auto">
              Update
            </button>
          )}
        </form>
      </div>
    </>
  );
};

export default UpdateProfile;
