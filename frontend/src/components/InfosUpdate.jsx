import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faL, faSpinner } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const InfosUpdate = () => {
  const { IsLoggedIn, setIsLoggedIn, User, Profile } = useContext(AuthContext);
  const [profile, setprofile] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [success, setsuccess] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    console.log(User, Profile);
  }, [User]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    console.log("La nouvelle image est: ", profile);

    try {
      //

      const response = await axios.put(
        `http://127.0.0.1:8000/api/profile/${Profile[0].id}/`,
        {
          profile: profile,
          role: Profile[0].role,
          user: Profile[0].user,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Successful updating: ", response.data);
      setsuccess(true);
      window.location.reload();

      navigate("/profile");
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="file"
              className="form-control w-25 d-block mx-auto  mb-3"
              //   value={Username}
              onChange={(e) => setprofile(e.target.files[0])}
              placeholder="Enter your profile"
              accept="image/*"
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
              Update the profile image
            </button>
          )}
        </form>
      </div>
    </>
  );
};

export default InfosUpdate;
