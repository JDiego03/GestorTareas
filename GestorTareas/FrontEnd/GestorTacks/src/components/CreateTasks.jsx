import React, { useEffect, useState } from "react";
import { getTarea } from "../../../services/tasks";
import { Navigate } from "react-router-dom";
import Header from "./Header";
import "../styles/CreateTasks.css"; // Importamos el archivo CSS

function CreateTasks() {
  const [volver, setVolver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tiposTareas, setTiposTareas] = useState([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState("Ver Todos");
  const [tarea, setTarea] = useState({
    nombre: "",
    descripcion: "",
    fecha: "",
    estado: "sin definir",
    dificultad: "medio",
    tipo: "",
    color: "",
  });

  const [errors, setErrors] = useState({
    nombre: "",
    fecha: "",
    tipo: "",
  });

  useEffect(() => {
    obtenerTiposTareas();
  }, []);

  // Obtener los tipos de tarea disponibles
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
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Error al obtener los tipos de tarea:", error);
    }
  };

  // Obtener el nombre del tipo de tarea
  const obtenerNombreTipo = async (index) => {
    if (!index) return "";
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:3000/tiposTareas/${index}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data.length > 0 ? data[0].tipo : "";
      }
    } catch (error) {
      console.error("Error al obtener el tipo de tarea:", error);
    }
    return "";
  };

  const obetenerColor = async (index) => {
    if (!index) return "";
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:3000/tiposTareas/${index}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data.length > 0 ? data[0].color : "";
      }
    } catch (error) {
      console.error("Error al obtener el tipo de tarea:", error);
    }
    return "";
  };

  // Validación de los campos del formulario
  const validateForm = () => {
    const newErrors = {};
    if (!tarea.nombre)
      newErrors.nombre = "El nombre de la tarea es obligatorio.";
    if (!tarea.fecha) newErrors.fecha = "La fecha es obligatoria.";
    if (!tarea.tipo) newErrors.tipo = "El tipo de tarea es obligatorio.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Obtener el nombre del tipo de tarea antes de enviar la solicitud
      const nombreTipo = await obtenerNombreTipo(tarea.tipo);
      const color = await obetenerColor(tarea.tipo);

      const nuevaTarea = {
        ...tarea,
        nombreTipo,
        color,
      };

      console.log(tarea);

      let respuesta = await getTarea(nuevaTarea);
      if (respuesta) {
        setVolver(true);
      } else {
        console.log("Error al crear la tarea");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTarea((prevTarea) => ({ ...prevTarea, [name]: value }));
  };

  // Redirigir al usuario a la lista de tareas si se creó la tarea
  if (volver) {
    return <Navigate to="/listTareas" />;
  }

  const getTareas = async (tipo) => {
    setTipoSeleccionado(tipo);
    console.log(`Obteniendo tareas del tipo: ${tipo}`);
  };

  return (
    <>
      <Header
        setTipoSeleccionado={setTipoSeleccionado}
        getTareas={getTareas}
        deshabilitarEnlaces={true}
      />
      <section className="form-container">
        <h3>Crear Tarea</h3>
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre de la tarea:</label>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre de la tarea"
              onChange={handleChange}
              value={tarea.nombre}
            />
            {errors.nombre && <span className="error">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción de la tarea:</label>
            <input
              type="text"
              name="descripcion"
              placeholder="Descripción de la tarea"
              onChange={handleChange}
              value={tarea.descripcion}
            />
          </div>

          <div className="form-group">
            <label htmlFor="fecha">Fecha de entrega:</label>
            <input
              type="date"
              name="fecha"
              onChange={handleChange}
              value={tarea.fecha}
            />
            {errors.fecha && <span className="error">{errors.fecha}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="estado">Estado:</label>
            <select name="estado" onChange={handleChange} value={tarea.estado}>
              <option value="sin definir">Sin definir</option>
              <option value="pendiente">Pendiente</option>
              <option value="finalizada">Finalizada</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dificultad">Dificultad:</label>
            <select
              name="dificultad"
              onChange={handleChange}
              value={tarea.dificultad}
            >
              <option value="medio">Medio</option>
              <option value="importante">Importante</option>
              <option value="sin importancia">Sin importancia</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tipo">Tipo de la tarea:</label>
            {tiposTareas.length > 0 ? (
              <select name="tipo" onChange={handleChange} value={tarea.tipo}>
                <option value="">Seleccione un tipo</option>
                {tiposTareas.map((tipoTarea) => (
                  <option key={tipoTarea.id} value={tipoTarea.id}>
                    {tipoTarea.tipo}
                  </option>
                ))}
              </select>
            ) : (
              <p>No tienes tipos de tareas disponibles.</p>
            )}
            {errors.tipo && <span className="error">{errors.tipo}</span>}
          </div>

          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? "Cargando..." : "Crear tarea"}
          </button>
          <button type="button" onClick={() => setVolver(true)}>
            Volver
          </button>
        </form>
      </section>
    </>
  );
}

export default CreateTasks;
