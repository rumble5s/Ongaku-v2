import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo-white.png";
import { Layout } from "../layouts";

export function LoginPage() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const SignIn = async () => {
    try {
      const response = await axios({
        method: "POST",
        url: BASE_URL + "user/sign_in",
        data: {
          username: username,
          password: password,
        },
      });

      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/");
    } catch (error) {
      alert(error.response.data);
    }
  };

  const SignUp = async () => {
    try {
      const response = await axios({
        method: "POST",
        url: BASE_URL + "user/sign_up",
        data: {
          username: username,
          password: password,
        },
      });

      alert(response.data);
    } catch (error) {
      alert(error.response.data);
    }
  };

  return (
    <Layout>
      {user != null ? (
        <div>You have been logged in !</div>
      ) : (
        <form
          className="position-fixed text-center"
          style={{ top: "35%", left: "35%", height: "30%", width: "30%" }}
        >
          <img src={logo} />
          <div className="form-group">
            <input
              className="form-control form-control-lg bg-transparent border-white "
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control form-control-lg bg-transparent border-white"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <h5 className="form-text">
              Join with us and listen music together!
            </h5>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-lg"
            onClick={SignIn}
          >
            Sign In
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-lg"
            onClick={SignUp}
          >
            Sign Up
          </button>
        </form>
      )}
    </Layout>
  );
}
