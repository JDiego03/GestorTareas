const URL = "http://localhost:3000";

export const userRegister = async (userData) => {
  try {
    const response = await fetch(`${URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en el registro:", error);
    return { error: "No se pudo registrar el usuario" };
  }
};

export const userLogin = async (userData) => {
  try {
    const response = await fetch(`${URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    console.log(data, "Registrado correctamente");
    return data;
  } catch (error) {
    console.error("Error en el login:", error);
    return { error: "No se pudo iniciar sesión" };
  }
};
