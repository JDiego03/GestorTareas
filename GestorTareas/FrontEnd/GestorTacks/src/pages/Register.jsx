import React, { useState } from "react";
import { userRegister } from "../../../services/user";
import "../styles/Register.css";
import { Navigate } from "react-router-dom";

export default function Register() {
  const [regiter, setRegister] = useState(false);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    userRegister(user);
    setRegister(true);
  };

  if (regiter) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="cont-form-register">
      <div className="form-container">
        <h2>Registro</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Nombre"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="password"
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-btn">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}
