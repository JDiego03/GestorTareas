import React, { useEffect, useState } from "react";
import "../styles/ListTareas.css";
import Header from "./Header";
import { Link } from "react-router-dom";

export default function ListTareas() {
  const [tareas, setTareas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setLogin] = useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [importanciaSeleccionada, setImportanciaSeleccionada] = useState("");

  const getTareas = async (tipo = null) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No tienes acceso. Inicia sesión.");
      setIsLoading(false);
      return;
    }

    try {
      const url =
        tipo && tipo !== "Ver Todos"
          ? `http://localhost:3000/tareas/tiposTarea/${tipo}`
          : "http://localhost:3000/tareas";
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTareas(data);
      console.log(data);
      setLogin(true);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTareas();
  }, []);

  const tareasFiltradas = Array.isArray(tareas)
    ? tareas.filter((tarea) => {
        const tareaFecha = new Date(tarea.fecha);
        const inicio = fechaInicio ? new Date(fechaInicio) : null;
        const fin = fechaFin ? new Date(fechaFin) : null;

        return (
          (!tipoSeleccionado || tarea.tipoTarea === tipoSeleccionado) &&
          (!inicio || tareaFecha >= inicio) &&
          (!fin || tareaFecha <= fin) &&
          (!importanciaSeleccionada ||
            tarea.dificultad === importanciaSeleccionada)
        );
      })
    : [];

  const tareasOrdenadas = [...tareasFiltradas].sort((a, b) => {
    return ordenAscendente
      ? new Date(a.fecha) - new Date(b.fecha)
      : new Date(b.fecha) - new Date(a.fecha);
  });

  return (
    <>
      <Header setTipoSeleccionado={setTipoSeleccionado} getTareas={getTareas} />
      <section className="container-ListaTareas">
        <div className="container-tareas">
          <h2>Sus Tareas</h2>
          <div className="filter-section">
            <label className="filter-label">
              Fecha Inicio:
              <input
                type="date"
                className="filter-input"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </label>
            <label className="filter-label">
              Fecha Fin:
              <input
                type="date"
                className="filter-input"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </label>
            <label className="filter-label">
              Importancia:
              <select
                className="filter-input"
                value={importanciaSeleccionada}
                onChange={(e) => setImportanciaSeleccionada(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="importante">Importante</option>
                <option value="medio">Medio</option>
                <option value="sin importancia">Sin importancia</option>
              </select>
            </label>
            <button
              className="filter-button"
              onClick={() => setOrdenAscendente(!ordenAscendente)}
            >
              Ordenar por Fecha (
              {ordenAscendente ? "Ascendente" : "Descendente"})
            </button>
          </div>

          <ul className="listTareas">
            {isLoading ? (
              <h2>Cargando...</h2>
            ) : isLogin ? (
              tareasOrdenadas.length > 0 ? (
                tareasOrdenadas.map((tarea) => (
                  <li
                    key={tarea.id}
                    className="tarea-card"
                    style={{
                      border: `2px solid ${tarea.color}`,
                    }}
                  >
                    <div>
                      <h3>{tarea.nombre}</h3>
                      <p>
                        <strong>Descripcion:</strong> {tarea.descripcion}
                      </p>
                      <p>
                        <strong>Fecha:</strong>{" "}
                        {new Date(tarea.fecha).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Estado:</strong> {tarea.estado}
                      </p>
                      <p>
                        <strong>Dificultad:</strong> {tarea.dificultad}
                      </p>
                      <p>
                        <strong>Tipo:</strong> {tarea.nombreTipo}
                      </p>
                      <Link to={`/listTareas/${tarea.id}`} className="button">
                        Ver detalles
                      </Link>
                    </div>
                  </li>
                ))
              ) : (
                <h2>No hay tareas disponibles</h2>
              )
            ) : (
              <h2>No estás logueado</h2>
            )}
          </ul>
        </div>

        <div className="cont-button">
          <Link to={"/postTasks"} className="button">
            Crear Tarea
          </Link>
        </div>
      </section>
    </>
  );
}
