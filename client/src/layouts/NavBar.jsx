import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-black.png";

export function NavBar() {
  const navigate = useNavigate();

  const Logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar bg-transparent border-white justify-content-between">
      <a className="navbar-brand" href="#">
        <img src={logo} className="d-inline-block align-top" alt="" />
      </a>
      <button
        type="button"
        className="btn btn-secondary btn-lg"
        onClick={Logout}
      >
        Log out
      </button>
    </nav>
  );
}
