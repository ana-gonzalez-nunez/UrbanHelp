
CREATE DATABASE IF NOT EXISTS UrbanHelp;
USE UrbanHelp;

-- ROL --
CREATE TABLE Rol (
    IdRol INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Descripcion VARCHAR(200)
);

INSERT INTO Rol (IdRol, Nombre, Descripcion) VALUES
(1, 'Ciudadano', 'Usuario que reporta incidencias'),
(2, 'Tecnico', 'Empleado que realiza reparaciones'),
(3, 'Gestor', 'Supervisa incidencias y asignaciones'),
(4, 'Administrador', 'Control total del sistema'),
(5, 'Supervisor', 'Controla calidad de actuaciones'),
(6, 'Operador', 'Atiende incidencias iniciales'),
(7, 'Inspector', 'Revisa incidencias en campo');


-- SERVICIO --
CREATE TABLE Servicio (
    IdServicio INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Ubicacion VARCHAR(150),
    Telefono VARCHAR(20),
    tipoServicio VARCHAR(50)
);

INSERT INTO Servicio (IdServicio, Nombre, Ubicacion, Telefono, tipoServicio) VALUES
(1, 'Alumbrado Público', 'Calle Industria 12', '958111001', 'Electricidad'),
(2, 'Limpieza Urbana', 'Polígono Norte 5', '958111002', 'Limpieza'),
(3, 'Mantenimiento Vial', 'Av. Andalucía 45', '958111003', 'Infraestructura'),
(4, 'Parques y Jardines', 'Camino Verde 8', '958111004', 'Zonas Verdes'),
(5, 'Señalización', 'Calle Tráfico 22', '958111005', 'Seguridad Vial'),
(6, 'Aguas Municipales', 'Av. del Río 9', '958111006', 'Saneamiento'),
(7, 'Mobiliario Urbano', 'Calle Centro 3', '958111007', 'Equipamiento');


-- USUARIO --
CREATE TABLE Usuario (
    IdUsuario INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Apellido1 VARCHAR(100) NOT NULL,
    Apellido2 VARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    Contrasena VARCHAR(255) NOT NULL,
    Telefono VARCHAR(20),
    FechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    EstadoCuenta BOOLEAN DEFAULT TRUE,
    /*rol ENUM('Ciudadano','Tecnico','Administrador') NOT NULL,*/
    IdRol INT NOT NULL, 
    IdServicio INT NULL,

    CONSTRAINT FK_Usuario_Servicio FOREIGN KEY (IdServicio) REFERENCES Servicio(IdServicio),
    CONSTRAINT FK_Usuario_Rol FOREIGN KEY (IdRol) REFERENCES Rol(IdRol)
);



INSERT INTO Usuario (IdUsuario, Nombre, Apellido1, Apellido2, Email, Contrasena, Telefono, FechaRegistro, EstadoCuenta, IdRol, IdServicio)
VALUES
(1, 'Carlos', 'Martínez', 'López', 'carlos.martinez@email.com', '1234', '600111111', '2024-03-15', 1, 1, NULL),
(2, 'Lucía', 'Fernández', 'Ruiz', 'lucia.fernandez@email.com', '1234', '600222222', '2024-05-20', 1, 1, NULL),
(3, 'Miguel', 'García', 'Santos', 'miguel.garcia@email.com', '1234', '600333333', '2024-09-01', 1, 2, 1),
(4, 'Ana', 'Torres', 'Vega', 'ana.torres@email.com', '1234', '600444444', '2025-01-10', 1, 2, 2),
(5, 'Pedro', 'López', 'Jiménez', 'pedro.lopez@email.com', '1234', '600555555', '2025-06-18', 1, 1, NULL),
(6, 'Elena', 'Sánchez', 'Morales', 'elena.sanchez@email.com', '1234', '600666666', '2025-09-22', 1, 2, 3),
(7, 'Javier', 'Romero', 'Castro', 'javier.romero@email.com', '1234', '600777777', '2026-01-05', 1, 4, NULL);


-- CATEGORIA --
CREATE TABLE Categoria (
    IdCategoria INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion VARCHAR(200)
);

INSERT INTO Categoria (IdCategoria, Nombre, Descripcion) VALUES
(1, 'Alumbrado', 'Problemas en farolas o iluminación pública'),
(2, 'Limpieza', 'Suciedad o acumulación de residuos'),
(3, 'Baches', 'Deterioro del asfalto'),
(4, 'Parques', 'Incidencias en zonas verdes'),
(5, 'Señalización', 'Problemas en señales de tráfico'),
(6, 'Agua', 'Fugas o problemas de saneamiento'),
(7, 'Mobiliario', 'Bancos, papeleras o elementos dañados');


-- INCIDENCIA --
CREATE TABLE Incidencia (
    IdIncidencia INT AUTO_INCREMENT PRIMARY KEY,
    Titulo VARCHAR(150) NOT NULL,
    Descripcion TEXT NOT NULL,
    FechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FechaCierre DATETIME NULL,
    Prioridad ENUM('Baja','Media','Urgente') NOT NULL,
    Direccion VARCHAR(200),    
    IdUsuarioCreador INT NOT NULL,
    IdCategoria INT NOT NULL,
    IdServicio INT NULL,
    IdTecnicoAsignado INT NULL,
    Estado ENUM('Pendiente','Asignada','En proceso','Solucionada','Denegada') NOT NULL,


    CONSTRAINT FK_Incidencia_UsuarioCreador
        FOREIGN KEY (IdUsuarioCreador) REFERENCES Usuario(IdUsuario),

    CONSTRAINT FK_Incidencia_Categoria
        FOREIGN KEY (IdCategoria) REFERENCES Categoria(IdCategoria),

    CONSTRAINT FK_Incidencia_Servicio
        FOREIGN KEY (IdServicio) REFERENCES Servicio(IdServicio),

    CONSTRAINT FK_Incidencia_Tecnico
        FOREIGN KEY (IdTecnicoAsignado) REFERENCES Usuario(IdUsuario)
);

INSERT INTO Incidencia(IdIncidencia, Titulo, Descripcion, FechaCreacion, FechaCierre, Estado, Prioridad, Direccion,
IdUsuarioCreador, IdCategoria, IdServicio, IdTecnicoAsignado)
VALUES
(1, 'Farola apagada', 'Farola sin funcionamiento desde hace 3 días', '2024-06-01', '2024-06-03', 'Solucionada', 'Urgente', 'Calle Mayor 15', 1, 1, 1, 3),
(2, 'Bache en avenida', 'Bache peligroso frente al colegio', '2024-10-12', NULL, 'En proceso', 'Urgente', 'Av. Andalucía 22', 2, 3, 3, 6),
(3, 'Basura acumulada', 'Contenedor desbordado', '2025-02-18', '2025-02-20', 'Solucionada', 'Media', 'Calle Sol 8', 1, 2, 2, 4),
(4, 'Banco roto', 'Banco partido en parque central', '2025-07-05', NULL, 'Asignada', 'Media', 'Parque Central', 2, 7, 7, NULL),
(5, 'Fuga de agua', 'Agua saliendo de alcantarilla', '2025-11-11', NULL, 'En proceso', 'Urgente', 'Calle Río 3', 1, 6, 6, 6),
(6, 'Señal caída', 'Señal de stop caída', '2026-01-20', NULL, 'Pendiente', 'Baja', 'Calle Norte 12', 2, 5, 5, NULL),
(7, 'Limpieza grafiti', 'Grafiti en fachada municipal', '2026-02-01', NULL, 'Denegada', 'Media', 'Plaza España 4', 1, 2,	2, 4);



-- IMAGEN --
CREATE TABLE Imagen (
    IdImagen INT AUTO_INCREMENT PRIMARY KEY,
    RutaImagen VARCHAR(255) NOT NULL,
    FechaSubida DATETIME DEFAULT CURRENT_TIMESTAMP,
    IdIncidencia INT NOT NULL,

    CONSTRAINT FK_Imagen_Incidencia
        FOREIGN KEY (IdIncidencia) REFERENCES Incidencia(IdIncidencia)
);

INSERT INTO Imagen (IdImagen, RutaImagen, FechaSubida, IdIncidencia) VALUES
(1, '/imagenes/farola1.jpg', '2024-06-01', 1),
(2, '/imagenes/bache1.jpg', '2024-10-12', 2),
(3, '/imagenes/basura1.jpg', '2025-02-18', 3),
(4, '/imagenes/banco1.jpg', '2025-07-05', 4),
(5, '/imagenes/fuga1.jpg', '2025-11-11', 5),
(6, '/imagenes/senal1.jpg', '2026-01-20', 6),
(7, '/imagenes/grafiti1.jpg', '2026-02-01', 7);



-- ACTUACION --
CREATE TABLE Actuacion (
    IdActuacion INT AUTO_INCREMENT PRIMARY KEY,
    DescripcionTrabajo TEXT NOT NULL,
    FechaInicio DATETIME,
    FechaFin DATETIME,
    MaterialesUtilizados VARCHAR(300),
    Observaciones VARCHAR(300),
    IdIncidencia INT NOT NULL,
    IdTecnico INT NOT NULL,

    CONSTRAINT FK_Actuacion_Incidencia
        FOREIGN KEY (IdIncidencia) REFERENCES Incidencia(IdIncidencia),

    CONSTRAINT FK_Actuacion_Tecnico
        FOREIGN KEY (IdTecnico) REFERENCES Usuario(IdUsuario)
);

INSERT INTO Actuacion
(IdActuacion, DescripcionTrabajo, FechaInicio, FechaFin, MaterialesUtilizados, Observaciones,
IdIncidencia, IdTecnico)
VALUES
(1, 'Reemplazo bombilla LED', '2024-06-02', '2024-06-03', 'Bombilla LED 50W', 'Funcionamiento restaurado', 1, 3),
(2, 'Inspección y señalización provisional', '2024-10-13', NULL, 'Conos de seguridad', 'Pendiente asfaltado', 2, 6),
(3, 'Retirada de residuos', '2025-02-19', '2025-02-20', 'Bolsa industrial', 'Zona limpia', 3, 4),
(4, 'Revisión inicial banco', '2025-07-06', NULL, 'Ninguno', 'Pendiente sustitución', 4, 6),
(5, 'Revisión fuga', '2025-11-12', NULL, 'Llave paso', 'Necesita maquinaria pesada', 5, 6),
(6, 'Evaluación señal', '2026-01-21', NULL, 'Soporte metálico', 'En espera de reposición', 6, 3),
(7, 'Limpieza grafiti', '2026-02-02', NULL, 'Disolvente especial', 'Parcialmente eliminado', 7, 4);



-- HISTORIAL ESTADO --
CREATE TABLE HistorialEstado (
    IdHistorial INT AUTO_INCREMENT PRIMARY KEY,
    EstadoAnterior ENUM('Pendiente','Asignada','En proceso','Solucionada','Denegada') NOT NULL,
    EstadoNuevo ENUM('Pendiente','Asignada','En proceso','Solucionada','Denegada') NOT NULL,
    FechaCambio DATETIME DEFAULT CURRENT_TIMESTAMP,
    Comentario VARCHAR(300),

    IdIncidencia INT NOT NULL,
    IdUsuario INT NOT NULL,

    CONSTRAINT FK_Historial_Incidencia
        FOREIGN KEY (IdIncidencia) REFERENCES Incidencia(IdIncidencia),

    CONSTRAINT FK_Historial_Usuario
        FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario)
);

INSERT INTO HistorialEstado
(IdHistorial, EstadoAnterior, EstadoNuevo, FechaCambio, Comentario, IdIncidencia, IdUsuario)
VALUES
(1, 'Pendiente', 'En proceso', '2024-06-02', 'Asignada a técnico', 1, 5),
(2, 'En proceso', 'Solucionada', '2024-06-03', 'Trabajo completado', 1, 3),
(3, 'Pendiente', 'En proceso', '2024-10-13', 'Revisión iniciada', 2, 5),
(4, 'Pendiente', 'Solucionada', '2025-02-20', 'Incidencia solucionada', 3, 4),
(5, 'Pendiente', 'En proceso', '2025-11-12', 'Fuga en reparación', 5, 5),
(6, 'Pendiente', 'En proceso', '2026-02-02', 'Grafiti en tratamiento', 7, 4),
(7, 'En proceso', 'Denegada', '2026-02-10', 'Pendiente confirmación', 7, 5);


