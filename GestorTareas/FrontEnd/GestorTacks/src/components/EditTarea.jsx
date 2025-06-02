import React, { useEffect, useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import Header from "./Header";
import "../styles/EditTarea.css";

export default function EditTarea() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tipoSeleccionado, setTipoSeleccionado] = useState("Ver Todos");
  const [tarea, setTarea] = useState({
    nombre: "",
    descripcion: "",
    fecha: "",
    estado: "sin definir",
    dificultad: "medio",
    tipoTarea: "",
    nombreTipo: "",
    color: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [redirigir, setRedirigir] = useState(false);
  const [tiposTareas, setTiposTareas] = useState([]);

  useEffect(() => {
    const fetchTarea = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`http://localhost:3000/tareas/${id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.length > 0) {
          let fechaFormateada = data[0].fecha
            ? new Date(data[0].fecha).toISOString().split("T")[0]
            : "";

          setTarea({ ...data[0], fecha: fechaFormateada });
        }
      } catch (error) {
        console.error(error);
        setMensaje("No se pudo cargar la tarea.");
      }
    };

    const fetchTipoTareas = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`http://localhost:3000/tiposTarea`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw Error("Error al encontrar los tipos de tareas");
        }
        const data = await response.json();
        setTiposTareas(data);
      } catch (error) {
        console.error(error);
        setMensaje("No se pudo cargar los tipos de tareas.");
      }
    };

    fetchTarea();
    fetchTipoTareas();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name !== "color") {
      setTarea((prevTarea) => {
        let updatedTarea = { ...prevTarea, [name]: value };

        if (name === "tipoTarea") {
          const tipoSeleccionado = tiposTareas.find(
            (tipo) => tipo.id === parseInt(value)
          );
          if (tipoSeleccionado) {
            updatedTarea.nombreTipo = tipoSeleccionado.tipo;
          }
        }

        return updatedTarea; // Retorna el objeto actualizado correctamente
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(tarea);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:3000/tareas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tarea),
      });
      if (!response.ok) throw new Error("Error al actualizar la tarea");
      setMensaje("Tarea actualizada correctamente.");
      setTimeout(() => setRedirigir(true), 1000);
    } catch (error) {
      console.error(error);
      setMensaje("Error al actualizar la tarea.");
    }
  };

  if (redirigir) {
    return <Navigate to="/listTareas" />;
  }

  return (
    <>
      <Header
        setTipoSeleccionado={setTipoSeleccionado}
        deshabilitarEnlaces={true}
      />
      <section className="edit-tarea-container">
        <h2 className="edit-tarea-title">Editar Tarea</h2>
        {mensaje && <p className="edit-tarea-message">{mensaje}</p>}
        <form className="edit-tarea-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            value={tarea.nombre}
            onChange={handleChange}
            required
            placeholder="Nombre"
          />
          <textarea
            name="descripcion"
            value={tarea.descripcion}
            onChange={handleChange}
            required
            placeholder="Descripción"
          />
          <input
            type="date"
            name="fecha"
            value={tarea.fecha}
            onChange={handleChange}
            required
          />
          <select name="estado" value={tarea.estado} onChange={handleChange}>
            <option value="sin definir">Sin Definir</option>
            <option value="finalizada">Finalizada</option>
            <option value="pendiente">Pendiente</option>
          </select>
          <select
            name="dificultad"
            value={tarea.dificultad}
            onChange={handleChange}
          >
            <option value="sin importancia">Sin importancia</option>
            <option value="medio">Medio</option>
            <option value="importante">Importante</option>
          </select>
          <input type="text" name="color" value={tarea.color} disabled />
          <select
            name="tipoTarea"
            value={tarea.tipoTarea}
            onChange={handleChange}
          >
            {tiposTareas.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.tipo}
              </option>
            ))}
          </select>
          <button type="submit">Guardar Cambios</button>
          <button type="button" onClick={() => navigate("/listTareas")}>
            Volver
          </button>
        </form>
      </section>
    </>
  );
}
