import React, { useEffect, useState } from "react";
import { userLogin } from "../../../services/user";
import { Link, Navigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [volver, setVolver] = useState(false);
  const [isLogin, setisLogin] = useState(false);

  const userExists = () => {
    const token = localStorage.getItem("token");
    if (token) {
      setisLogin(true);
    }
  };

  useEffect(() => {
    userExists();
  }, []);

  if (isLogin) {
    return <Navigate to="/listTareas" />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await userLogin(formData);
    if (result.token) {
      setToken(result.token);
      localStorage.setItem("token", result.token);
      setVolver(true);
    } else {
      setMessage(result.error);
    }
  };

  if (volver) {
    return <Navigate to="/listTareas" />;
  }

  return (
    <div className="cont-form-login">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="cont-form">
        <div className="cont">
          <label>Email: </label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
        </div>
        <div className="cont">
          <label>Contaseña: </label>
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="botonLogin">
          Iniciar Sesión
        </button>
        <p>
          ¿Todavia no estas registrado? <Link to="/register">Registrarme</Link>
        </p>
      </form>
      {message && <p>{message}</p>}
      {token && <p>Token: {token}</p>}
    </div>
  );
};

export default Login;
