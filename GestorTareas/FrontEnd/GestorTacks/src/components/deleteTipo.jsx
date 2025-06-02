import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import "../styles/deleteTipo.css"; // Importa el archivo CSS

function DeleteTipo() {
  const [tiposTareas, setTiposTareas] = useState([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState("VerTodos");

  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate(); // Hook para redirigir

  useEffect(() => {
    obtenerTiposTareas();
  }, []);

  const getTareas = async (tipo) => {
    setTipoSeleccionado(tipo);
    console.log(`Obteniendo tareas del tipo: ${tipo}`);
  };

  const obtenerTiposTareas = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/tiposTarea", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTiposTareas(data);
      } else {
        setMensaje("Error al obtener los tipos de tarea");
      }
    } catch (error) {
      console.error("Error al obtener los tipos de tarea:", error);
      setMensaje("Error de conexión");
    }
  };

  const eliminarTipo = async () => {
    if (!tipoSeleccionado) {
      setMensaje("Seleccione un tipo de tarea");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:3000/tiposTareas/${tipoSeleccionado}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log(tipoSeleccionado);
      if (response.ok) {
        setMensaje("Tipo de tarea eliminado correctamente");
        setTiposTareas(
          tiposTareas.filter((tipo) => tipo.tipo !== tipoSeleccionado)
        );
        setTipoSeleccionado("");

        // Redirigir a la lista de tareas después de un breve retraso
        setTimeout(() => {
          navigate("/listTareas");
        }, 1000);
      } else {
        setMensaje(data.message || "Error al eliminar el tipo de tarea");
      }
    } catch (error) {
      console.error("Error al eliminar el tipo de tarea:", error);
      setMensaje("Error de conexión");
    }
  };

  return (
    <>
      <Header
        setTipoSeleccionado={setTipoSeleccionado}
        getTareas={getTareas}
        deshabilitarEnlaces={true}
      />
      <div className="delete-tipo-container">
        <h2 className="delete-tipo-title">Eliminar Sección</h2>
        {mensaje && <p className="delete-tipo-message">{mensaje}</p>}
        <div className="delete-tipo-select-container">
          <label className="delete-tipo-label" htmlFor="tipo">
            Seleccione un tipo
          </label>
          <select
            id="tipo"
            value={tipoSeleccionado}
            onChange={(e) => setTipoSeleccionado(e.target.value)}
            className="delete-tipo-select"
          >
            <option value="">Seleccione un tipo</option>
            {tiposTareas.map((tipo) => (
              <option key={tipo.tipo} value={tipo.id}>
                {tipo.tipo}
              </option>
            ))}
          </select>
        </div>
        <button onClick={eliminarTipo} className="delete-tipo-button">
          Eliminar
        </button>
        <button
          type="button"
          onClick={() => {
            navigate("/listTareas");
          }}
        >
          Volver
        </button>
      </div>
    </>
  );
}

export default DeleteTipo;
