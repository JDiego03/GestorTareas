import React, { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

function EditSeccion() {
  const [tipos, setTipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [tipoACambiar, setTipoACambiar] = useState(null);
  const [tipo, setTipo] = useState({ color: "" });
  const navigate = useNavigate();

  useEffect(() => {
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

        if (!response.ok) {
          localStorage.removeItem("token");
          throw new Error("Error al obtener los tipos de tarea.");
        }

        const data = await response.json();
        setTipos(data);
      } catch (error) {
        console.error(error);
      } finally {
        setCargando(false);
      }
    };
    obtenerTiposTareas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tipoACambiar) {
      alert("Seleccione un tipo de tarea primero.");
      return;
    }

    const id = tipoACambiar[0].id;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:3000/editTipo/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tipo),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la tarea");
      }

      alert("Tarea actualizada correctamente.");
      setTimeout(() => navigate("/listTareas"), 1000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = async (e) => {
    const id = e.target.value;
    const token = localStorage.getItem("token");
    if (!id) return;

    try {
      const response = await fetch(`http://localhost:3000/tiposTareas/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.log(response);
        throw new Error("Error al obtener el tipo de tarea.");
      }

      const data = await response.json();
      setTipoACambiar(data);
    } catch (error) {
      console.error(error);
      alert("Error al obtener los detalles del tipo de tarea.");
    }
  };

  return (
    <>
      <Header deshabilitarEnlaces={true} />
      <section className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
        {cargando ? (
          <h2 className="text-lg font-semibold text-center">Cargando...</h2>
        ) : tipos.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-700">
              Editar Tipo de Tarea
            </h2>

            {/* Select de Tipos */}
            <select
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            >
              <option value="">Seleccione un tipo</option>
              {tipos.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.tipo}
                </option>
              ))}
            </select>

            {/* Botón Volver */}
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700 transition"
              onClick={() => navigate("/listTareas")}
            >
              Volver
            </button>

            {/* Formulario de Cambio de Color */}
            {tipoACambiar ? (
              <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                <p className="text-gray-600">
                  Cambiar color de la sección:{" "}
                  <strong>{tipoACambiar.tipo}</strong>
                </p>
                <div className="flex items-center space-x-4">
                  <label htmlFor="color" className="text-gray-700">
                    Nuevo color:
                  </label>
                  <input
                    type="color"
                    className="border rounded-md w-10 h-10 cursor-pointer"
                    onChange={(e) => setTipo({ color: e.target.value })}
                    value={tipo.color}
                    name="color"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Guardar Cambios
                </button>
              </form>
            ) : (
              <p className="text-gray-500">
                Seleccione un tipo de tarea para editar.
              </p>
            )}
          </div>
        ) : (
          <p className="text-red-500">No hay tipos de tareas disponibles</p>
        )}
      </section>
    </>
  );
}

export default EditSeccion;
