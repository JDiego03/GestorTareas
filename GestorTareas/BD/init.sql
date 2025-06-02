CREATE DATABASE IF NOT EXISTS mi_base_de_datos;
USE mi_base_de_datos;

-- Crear tabla de usuarios
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Crear tabla de tipos de tareas
CREATE TABLE tipo_tarea (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(20) NOT NULL,
    userid INT NOT NULL,
    color VARCHAR(20) NOT NULL,  -- Se cambió TEXT a VARCHAR(20)
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
);

-- Crear tabla de tareas
CREATE TABLE tarea (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipoTarea INT NOT NULL,  -- Se cambió VARCHAR(20) a INT
    nombreTipo VARCHAR(20) NOT NULL,
    userid INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,  -- Se cambió TEXT a VARCHAR(255)
    descripcion TEXT NOT NULL,
    color VARCHAR(20) NOT NULL,
    fecha DATE NOT NULL,
    estado ENUM('pendiente', 'finalizada', 'sin definir') DEFAULT 'sin definir',
    dificultad ENUM('importante', 'medio', 'sin importancia') DEFAULT 'medio',
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tipoTarea) REFERENCES tipo_tarea(id) ON DELETE CASCADE
);
