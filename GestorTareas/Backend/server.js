require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());
app.use(cors());

// Conexión a MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "mi_base_de_datos",
  port: process.env.DB_PORT || 3306,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar con la base de datos:", err);
    process.exit(1);
  } else {
    console.log("✅ Conexión exitosa con la base de datos");
  }
});

// Middleware de autenticación con JWT
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res
      .status(401)
      .json({ error: "Acceso denegado, token no proporcionado" });

  try {
    const verified = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    req.user = verified; // Guarda los datos del usuario en req.user
    next(); // Continúa con la siguiente función
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
};

// 🔹 REGISTRAR USUARIO (Hasheando la contraseña)
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    // Hashear la contraseña
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Guardar en la base de datos
    db.query(
      "INSERT INTO users (nombre, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword],
      (err, result) => {
        if (err) {
          console.error("❌ Error al registrar usuario:", err);
          return res.status(500).json({ error: "Error en el registro" });
        }
        res.json({ mensaje: "Usuario registrado correctamente" });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// 🔹 LOGIN (Validando contraseña y generando JWT)
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email y contraseña son obligatorios" });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) {
        console.error("❌ Error en la consulta de usuario:", err);
        return res.status(500).json({ error: "Error en el servidor" });
      }

      if (result.length === 0) {
        return res.status(400).json({ error: "Usuario no encontrado" });
      }

      const user = result[0];

      // Comparar la contraseña ingresada con el hash almacenado
      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Contraseña incorrecta" });
      }

      // Generar JWT
      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: "9999999999h" }
      );

      res.json({ token });
    }
  );
});

app.get("/tiposTarea", authMiddleware, (req, res) => {
  const userid = req.user.id;
  db.query(
    "SELECT * FROM tipo_tarea WHERE userid = ?",
    [userid],
    (err, results) => {
      if (err) {
        console.error("❌ Error en la consulta de usuarios:", err);
        return res
          .status(500)
          .json({ error: "Error al obtener los tipos de tareas" });
      }
      res.json(results);
    }
  );
});

app.post("/tiposTarea", authMiddleware, (req, res) => {
  const { tipo, color } = req.body;
  const userid = req.user.id;
  db.query(
    "INSERT INTO tipo_tarea (tipo, userid, color) VALUES (?, ?, ?)",
    [tipo, userid, color],
    (err, results) => {
      if (err) {
        console.error("❌ Error en la consulta de tipoTareas:", err);
        return res
          .status(500)
          .json({ error: "Error al obtener los TipoTareas" });
      }
      res.json(results);
    }
  );
});

// 🔹 OBTENER USUARIOS (Ruta protegida con middleware)
app.get("/users", authMiddleware, (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("❌ Error en la consulta de usuarios:", err);
      return res.status(500).json({ error: "Error al obtener los usuarios" });
    }
    res.json({ usuarios: results });
  });
});

// 🔹 OBTENER TAREAS (Ruta protegida)
app.get("/tareas", authMiddleware, (req, res) => {
  db.query(
    "SELECT * FROM tarea WHERE userid = ?", // Corregido a "tarea" (singular)
    [req.user.id],
    (err, results) => {
      if (err) {
        console.error("❌ Error en la consulta de tareas:", err);
        return res.status(500).json({ error: "Error al obtener las tareas" });
      }
      res.json(results);
    }
  );
});

app.get("/tareas/:id", authMiddleware, (req, res) => {
  try {
    const idTarea = parseInt(req.params.id);
    if (!idTarea) {
      return res.json({ error: "Su id es nulo" });
    }
    const query = "SELECT * FROM tarea WHERE id = ?";
    db.query(query, [idTarea], async (err, result) => {
      if (err) {
        console.log("error en su busqueda");
        return res.status(500).json({ error: "Error en su consulta" });
      }
      res.json(result);
    });
  } catch (mensaje) {
    console.log(mensaje);
  }
});

// 🔹 ACTUALIZAR TAREA (Ruta protegida)
app.put("/tareas/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    descripcion,
    fecha,
    estado,
    dificultad,
    tipoTarea,
    nombreTipo,
  } = req.body;
  const userid = req.user.id;
  console.log(req.body);
  if (
    !nombre ||
    !descripcion ||
    !fecha ||
    !estado ||
    !dificultad ||
    !tipoTarea ||
    !nombreTipo
  ) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  db.query(
    "SELECT color FROM tarea WHERE id = ? AND userid = ?",
    [id, userid],
    (err, results) => {
      if (err) {
        console.error("❌ Error al buscar la tarea:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
      }

      if (results.length === 0) {
        return res.status(404).json({
          error: "Tarea no encontrada o no tienes permiso para modificarla",
        });
      }

      const colorActual = results[0].color;

      db.query(
        "UPDATE tarea SET nombre = ?, descripcion = ?, fecha = ?, estado = ?, dificultad = ?, tipoTarea = ?, color = ?, nombreTipo = ? WHERE id = ? AND userid = ?",
        [
          nombre,
          descripcion,
          fecha,
          estado,
          dificultad,
          tipoTarea,
          colorActual,
          nombreTipo,
          id,
          userid,
        ],
        (err, result) => {
          if (err) {
            console.error("❌ Error al actualizar la tarea:", err);
            return res
              .status(500)
              .json({ error: "Error al actualizar la tarea" });
          }

          if (result.affectedRows === 0) {
            return res
              .status(400)
              .json({ error: "No se realizaron cambios en la tarea" });
          }

          res.json({ mensaje: "Tarea actualizada correctamente" });
        }
      );
    }
  );
});

// 🔹 CREAR TAREA (Ruta protegida)
app.post("/tareas", authMiddleware, (req, res) => {
  const {
    nombre,
    descripcion,
    fecha,
    estado,
    dificultad,
    tipo,
    nombreTipo,
    color,
  } = req.body;
  const userid = req.user.id; // Obtener el ID del usuario autenticado

  console.log(req.body);

  if (
    !descripcion ||
    !fecha ||
    !estado ||
    !dificultad ||
    !tipo ||
    !nombre ||
    !nombreTipo ||
    !color
  ) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  db.query(
    "INSERT INTO tarea (nombre, descripcion, fecha, estado, dificultad, userid, tipoTarea, nombreTipo, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      nombre,
      descripcion,
      fecha,
      estado,
      dificultad,
      userid,
      tipo,
      nombreTipo,
      color,
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Error al insertar tarea:", err);
        return res.status(500).json({ error: "Error al crear tarea" });
      }
      res.json({ mensaje: "Tarea creada correctamente" });
    }
  );
});

app.delete("/tiposTareas/:id", authMiddleware, (req, res) => {
  const userid = req.user.id;
  const id = req.params.id;

  db.query("SELECT * FROM tipo_tarea WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error al hacer su consulta" });
    }

    if (result.length === 0) {
      return res.status(500).json({ message: "El tipo no existe" });
    }

    const tareaUserId = result[0].userid;

    if (tareaUserId != userid) {
      return res.status(500).json({ message: "Este tipo de tarea no suyo" });
    }
    db.query("DELETE FROM tipo_tarea WHERE id = ?", [id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error al eliminar la tarea" });
      } else {
        console.log("Su tipo de tarea se elimino");
        return res
          .status(200)
          .json({ message: "su tipo se elimino correctamente" });
      }
    });
  });
});

app.delete("/tareas/:id", authMiddleware, (req, res) => {
  const userid = req.user.id;
  const id = req.params.id;

  db.query("SELECT * FROM tarea WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error al hacer su consulta" });
    }

    if (result.length === 0) {
      return res.status(500).json({ message: "La tarea no existe" });
    }

    const tareaUserId = result[0].userid;

    if (tareaUserId != userid) {
      return res.status(500).json({ message: "Esta tarea no es suya" });
    }
    db.query("DELETE FROM tarea WHERE id = ?", [id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error al eliminar la tarea" });
      } else {
        console.log("Su tarea se elimino");
        return res
          .status(200)
          .json({ message: "su tarea se elimino correctamente" });
      }
    });
  });
});

app.get("/tiposTareas/:id", authMiddleware, (req, res) => {
  const userid = req.user.id;
  const id = req.params.id;

  console.log(id);

  db.query(
    "SELECT * FROM tipo_tarea WHERE id = ? && userid = ?",
    [id, userid],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error al hacer su consulta" });
      }

      if (result.length === 0) {
        return res.status(500).json({ message: "La tarea no existe" });
      }
      return res.status(200).json(result);
    }
  );
});

app.get("/tareas/tiposTarea/:id", authMiddleware, (req, res) => {
  const userid = req.user.id;
  const tarea_ID = req.params.id;

  if (!userid || !tarea_ID) {
    res.status(400).json({ message: "Faltan datos obligatorios" });
  }
  db.query(
    "SELECT * FROM tarea WHERE tipoTarea = ? && userid = ?",
    [tarea_ID, userid],
    (error, results) => {
      try {
        if (error) {
          res.status(400).json({ message: "Ha ocurrido algun error" });
          console.log(error);
        } else {
          res.status(200).json(results);
        }
      } catch (e) {
        res.status(400).json({ message: "Error en el codigo" });
      }
    }
  );
});

app.put("/editTipo/:id", authMiddleware, (req, res) => {
  const id = req.params.id;
  const userid = req.user.id;
  const { color } = req.body;

  if (!color) {
    return res.status(400).json({ error: "El campo 'color' es obligatorio" });
  }

  db.query(
    "SELECT * FROM tipo_tarea WHERE id = ? AND userid = ?",
    [id, userid],
    (err, result) => {
      if (err) {
        console.error("❌ Error en la consulta:", err);
        return res
          .status(500)
          .json({ error: "Error al consultar el tipo de tarea" });
      }

      if (result.length === 0) {
        return res.status(404).json({
          error: "Tipo de tarea no encontrado o no pertenece al usuario",
        });
      }

      // 🔹 1️⃣ Actualizar el color en tipo_tarea
      db.query(
        "UPDATE tipo_tarea SET color = ? WHERE id = ? AND userid = ?",
        [color, id, userid],
        (err, updateResult) => {
          if (err) {
            console.error("❌ Error al actualizar el tipo de tarea:", err);
            return res
              .status(500)
              .json({ error: "Error al actualizar el tipo de tarea" });
          }

          if (updateResult.affectedRows === 0) {
            return res
              .status(400)
              .json({ error: "No se realizaron cambios en el tipo de tarea" });
          }

          // 🔹 2️⃣ Actualizar todas las tareas asociadas a este tipoTarea
          db.query(
            "UPDATE tarea SET color = ? WHERE tipoTarea = ? AND userid = ?",
            [color, id, userid],
            (err, tareaUpdateResult) => {
              if (err) {
                console.error("❌ Error al actualizar las tareas:", err);
                return res
                  .status(500)
                  .json({ error: "Error al actualizar las tareas" });
              }

              res.json({
                mensaje:
                  "Color del tipo de tarea y sus tareas asociadas actualizado correctamente",
              });
            }
          );
        }
      );
    }
  );
});

// 🔹 Cerrar conexión al detener el servidor
process.on("SIGINT", () => {
  db.end((err) => {
    console.log("🔌 Conexión con la base de datos cerrada");
    process.exit(err ? 1 : 0);
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
