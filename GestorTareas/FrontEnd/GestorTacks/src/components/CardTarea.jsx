import React from "react";
import { Link } from "react-router-dom";
import "../styles/CardTarea.css";

export default function CardTarea(props) {
  const { tarea } = props;
  return (
    <>
      <div className="task-card">
        <p className="info-name">{tarea.nombre}</p>
        <p>{tarea.enlace}</p>
        <Link to={`/listTareas/${tarea.id}`} className="link">
          Saber Mas
        </Link>
      </div>
    </>
  );
}
