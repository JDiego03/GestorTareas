import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import "../styles/DetailsTarea.css"; // Importamos los estilos

export default function DetailsTarea() {
  const { id } = useParams();
  const [tarea, setTarea] = useState(null);
  const [isLogin, setLogin] = useState(false);
  const [volver, setVolver] = useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState("Ver Todos");
  const navigate = useNavigate();

  const findTarea = async (index) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No hay token");
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/tareas/${index}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener la tarea");
      }
      const data = await response.json();
      setTarea(data[0]);
      setLogin(true);
    } catch (error) {
      console.log("Error al obtener la tarea", error);
    }
  };

  const deleteTarea = async (index) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:3000/tareas/${index}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVolver(true);
    } catch (e) {
      console.log(e);
    }
  };

  const getTareas = async (tipo) => {
    setTipoSeleccionado(tipo);
    console.log(`Obteniendo tareas del tipo: ${tipo}`);
  };

  useEffect(() => {
    findTarea(id);
  }, [id]);

  if (volver) {
    return <Navigate to="/listTareas" />;
  }

  return (
    <>
      <Header
        setTipoSeleccionado={setTipoSeleccionado}
        getTareas={getTareas}
        deshabilitarEnlaces={true}
      />
      {isLogin ? (
        tarea ? (
          <section className="details-container">
            <h3 className="details-title">Tarea ID: {tarea.id}</h3>
            <div className="details-info">
              <p className="details-text">
                <span>Nombre:</span> {tarea.nombre}
              </p>
              <p className="details-text">
                <span>Descripción:</span> {tarea.descripcion}
              </p>
              <p className="details-text">
                <span>Fecha:</span> {new Date(tarea.fecha).toLocaleDateString()}
              </p>
              <p className="details-text">
                <span>Estado:</span> {tarea.estado}
              </p>
              <p className="details-text">
                <span>Dificultad:</span> {tarea.dificultad}
              </p>
            </div>

            <div className="details-actions">
              <Link to="/listTareas" className="details-link">
                Volver a la lista
              </Link>
              <button
                type="button"
                onClick={() => deleteTarea(tarea.id)}
                className="details-button"
                aria-label="Eliminar Tarea"
              >
                Eliminar Tarea
              </button>
              <button
                type="button"
                onClick={() => navigate(`/editTarea/${tarea.id}`)}
              >
                Editar Tarea
              </button>
            </div>
          </section>
        ) : (
          <h2 className="loading-message">Cargando...</h2>
        )
      ) : (
        <h2 className="error-message">No estás logueado</h2>
      )}
    </>
  );
}
