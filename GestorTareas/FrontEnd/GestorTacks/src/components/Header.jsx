import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import { useEffect, useState } from "react";

function Header({
  setTipoSeleccionado,
  getTareas,
  deshabilitarEnlaces = false,
}) {
  const navigate = useNavigate();
  const [tiposTareas, setTiposTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleCerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/");
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
        localStorage.removeItem("token");
        setError("Error al obtener los tipos de tarea");
      }
    } catch (error) {
      setError("Error al obtener los tipos de tarea");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerTiposTareas();
  }, []);

  return (
    <header className="container-Header">
      <h2>Bienvenido</h2>
      <div
        onClick={handleCerrarSesion}
        style={{
          cursor: "pointer",
          backgroundColor: "red", // Rosa pastel
          color: "white",
          padding: "8px 16px", // Espaciado
          borderRadius: "8px", // Bordes redondeados
          textAlign: "center", // Centrar el texto
          transition: "background-color 0.2s ease", // Transición suave
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#f472b6")} // Rosa más fuerte al pasar el mouse
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#f9a8d4")} // Volver al color rosa pastel
        onMouseDown={(e) => (e.target.style.backgroundColor = "#db2777")} // Rosa aún más fuerte al hacer clic
        onMouseUp={(e) => (e.target.style.backgroundColor = "#f472b6")} // Volver al color rosa más fuerte al soltar el clic
      >
        Cerrar Sesión
      </div>

      <h3>Su Menú</h3>
      <h4>
        <Link
          className={`link ${deshabilitarEnlaces ? "disabled-link" : ""}`}
          to={deshabilitarEnlaces ? "#" : "/createTipo"}
        >
          Crear Sección
        </Link>
      </h4>
      <h4>
        <Link
          className={`link ${deshabilitarEnlaces ? "disabled-link" : ""}`}
          to={deshabilitarEnlaces ? "#" : "/editSeccion"}
        >
          Editar Sección
        </Link>
      </h4>
      <h4>
        <Link
          className={`link ${deshabilitarEnlaces ? "disabled-link" : ""}`}
          to={deshabilitarEnlaces ? "#" : "/deleteTipo"}
        >
          Eliminar Sección
        </Link>
      </h4>
      {error && <h4 className="error-message">{error}</h4>}
      {loading ? (
        <h2>Cargando...</h2>
      ) : (
        <ul>
          <li
            onClick={() => !deshabilitarEnlaces && getTareas("Ver Todos")}
            style={{ cursor: deshabilitarEnlaces ? "default" : "pointer" }}
          >
            <p
              className={`container-tipoTarea ${
                deshabilitarEnlaces ? "disabled" : ""
              }`}
            >
              Ver Todos
            </p>
          </li>
          {tiposTareas.length > 0 ? (
            tiposTareas.map((tipoTarea) => (
              <li
                key={tipoTarea.tipo}
                onClick={() => !deshabilitarEnlaces && getTareas(tipoTarea.id)}
                style={{ cursor: deshabilitarEnlaces ? "default" : "pointer" }}
              >
                <p
                  className={`container-tipoTarea ${
                    deshabilitarEnlaces ? "disabled" : ""
                  }`}
                >
                  {tipoTarea.tipo}
                </p>
              </li>
            ))
          ) : (
            <h2>No hay tipos de tarea disponibles.</h2>
          )}
        </ul>
      )}
    </header>
  );
}

export default Header;
