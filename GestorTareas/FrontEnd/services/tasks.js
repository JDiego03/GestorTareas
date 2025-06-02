export const getTareas = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return false;
  }

  try {
    const response = await fetch("http://localhost:3000/tareas", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log("Tareas obtenidas:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    return false;
  }
};

export const getTarea = async (tarea) => {
  console.log(tarea);
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No tienes acceso. Inicia sesión.");
    return false;
  }
  try {
    const response = await fetch("http://localhost:3000/tareas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nombre: tarea.nombre,
        descripcion: tarea.descripcion,
        fecha: tarea.fecha,
        estado: tarea.estado,
        dificultad: tarea.dificultad,
        tipo: tarea.tipo,
        nombreTipo: tarea.nombreTipo,
        color: tarea.color,
      }),
    });

    if (response.ok) {
      return true;
    } else {
      console.error("Error al crear la tarea:", await response.json());
      return false;
    }
  } catch (error) {
    console.error("Error en la petición:", error);
    return false;
  }
};
