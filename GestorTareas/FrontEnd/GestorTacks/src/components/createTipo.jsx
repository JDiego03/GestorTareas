import { useState } from "react";
import Header from "./Header";
import { Navigate } from "react-router-dom";
import "../styles/createTipo.css"; // Importa el archivo CSS

const CreateTipo = () => {
  const [tipoSeleccionado, setTipoSeleccionado] = useState("Ver Todos");
  const [tiposTareas, setTiposTareas] = useState({
    tipo: "",
    color: "",
  });
  const [volver, setVolver] = useState(false);

  const enviarPost = async () => {
    console.log(tiposTareas);
    const token = localStorage.getItem("token");

    await fetch("http://localhost:3000/tiposTarea", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(tiposTareas),
    });
  };

  const handleForm = async (e) => {
    e.preventDefault();
    enviarPost();
    setVolver(true);
  };

  const handleTipo = (e) => {
    setTiposTareas({ ...tiposTareas, tipo: e.target.value });
  };
  const handleColor = (e) => {
    setTiposTareas({ ...tiposTareas, color: e.target.value });
  };

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
      <section className="create-tipo-section">
        <div className="create-tipo-container">
          <form onSubmit={handleForm} className="create-tipo-form">
            <div className="create-tipo-input-container">
              <label htmlFor="tipo" className="create-tipo-label">
                Name Section
              </label>
              <input
                type="text"
                required
                name="tipo"
                value={tiposTareas.tipo}
                onChange={handleTipo}
                placeholder="Nombre"
                className="create-tipo-input"
              />
            </div>
            <div className="create-tipo-input-container">
              <label htmlFor="color">Eliga el color de la seccion</label>
              <input
                type="color"
                required
                onChange={handleColor}
                value={tiposTareas.color}
                name="color"
                className="create-tipo-input"
              />
            </div>
            <button type="submit" className="create-tipo-button">
              Enviar
            </button>

            <button
              type="button"
              onClick={() => {
                setVolver(true);
              }}
            >
              Volver
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default CreateTipo;
