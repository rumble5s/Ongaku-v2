import React from "react";
import ReactDOM from "react-dom/client";
import { LoginPage, MainPage, RoomPage } from "./pages/index";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./App.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

function CheckRoute({ children }) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const room = JSON.parse(localStorage.getItem("room"));

  if (location.pathname != "/login" && !user) {
    return <Navigate to="/login" />;
  }

  if (location.pathname == "/room" && !room) {
    return <Navigate to="/" />;
  }

  if (location.pathname != "/room" && room) {
    return <Navigate to="/room" />;
  }

  return children;
}

root.render(
  <HashRouter>
    <Routes>
      <Route
        path="/login"
        element={
          <CheckRoute>
            <LoginPage />
          </CheckRoute>
        }
      />
      <Route
        path=""
        element={
          <CheckRoute>
            <MainPage />
          </CheckRoute>
        }
      />
      <Route
        path="/room"
        element={
          <CheckRoute>
            <RoomPage />
          </CheckRoute>
        }
      />
    </Routes>
  </HashRouter>
);
