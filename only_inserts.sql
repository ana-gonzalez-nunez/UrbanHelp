INSERT INTO Rol (IdRol, Nombre, Descripcion) VALUES
(1, 'Ciudadano',     'Usuario que reporta incidencias'),
(2, 'Tecnico',       'Empleado que realiza reparaciones'),
(3, 'Gestor',        'Supervisa incidencias y asignaciones'),
(4, 'Administrador', 'Control total del sistema'),
(5, 'Supervisor',    'Controla calidad de actuaciones'),
(6, 'Operador',      'Atiende incidencias iniciales'),
(7, 'Inspector',     'Revisa incidencias en campo');
INSERT INTO Servicio (IdServicio, Nombre, Ubicacion, Telefono, tipoServicio) VALUES
(1, 'Alumbrado Publico',  'Calle Industria 12', '958111001', 'Electricidad'),
(2, 'Limpieza Urbana',    'Poligono Norte 5',   '958111002', 'Limpieza'),
(3, 'Mantenimiento Vial', 'Av. Andalucia 45',   '958111003', 'Infraestructura'),
(4, 'Parques y Jardines', 'Camino Verde 8',      '958111004', 'Zonas Verdes'),
(5, 'Senalizacion',       'Calle Trafico 22',   '958111005', 'Seguridad Vial'),
(6, 'Aguas Municipales',  'Av. del Rio 9',       '958111006', 'Saneamiento'),
(7, 'Mobiliario Urbano',  'Calle Centro 3',      '958111007', 'Equipamiento');
INSERT INTO Usuario (IdUsuario, Nombre, Apellido1, Apellido2, Email, Contrasena, Telefono, FechaRegistro, EstadoCuenta, IdRol, IdServicio)
VALUES
(1,  'Carlos',  'Martinez', 'Lopez',   'carlos.martinez@urbanhelp.es', '1234',   '611234501', '2024-03-15', 1, 1, NULL),
(2,  'Lucia',   'Fernandez','Ruiz',    'lucia.fernandez@urbanhelp.es', '1234',   '611234502', '2024-05-20', 1, 1, NULL),
(3,  'Miguel',  'Garcia',   'Santos',  'miguel.garcia@urbanhelp.es',   '1234',   '611234503', '2024-09-01', 1, 2, 1),
(4,  'Ana',     'Torres',   'Vega',    'ana.torres@urbanhelp.es',      '1234',   '611234504', '2025-01-10', 1, 2, 2),
(5,  'Pedro',   'Lopez',    'Jimenez', 'pedro.lopez@urbanhelp.es',     '1234',   '611234505', '2025-06-18', 1, 1, NULL),
(6,  'Elena',   'Sanchez',  'Morales', 'elena.sanchez@urbanhelp.es',   '1234',   '611234506', '2025-09-22', 1, 2, 3),
(7,  'Javier',  'Romero',   'Castro',  'javier.romero@urbanhelp.es',   '1234',   '611234507', '2026-01-05', 1, 4, NULL),
(8,  'Maria',   'Garcia',   'Lopez',   'user@urbanhelp.es',            '123456', '611234508', '2026-04-11', 1, 1, NULL),
(9,  'Roberto', 'Martinez', 'Ruiz',    'tecnico@urbanhelp.es',         '123456', '611234509', '2026-04-11', 1, 2, 1),
(10, 'Isabel',  'Sanchez',  'Molina',  'admin@urbanhelp.es',           '123456', '611234510', '2026-04-11', 1, 4, NULL));
INSERT INTO Categoria (IdCategoria, Nombre, Descripcion) VALUES
(1, 'Alumbrado',             'Problemas en farolas o iluminacion publica'),
(2, 'Limpieza',              'Suciedad o acumulacion de residuos'),
(3, 'Via publica',           'Problemas en infraestructura vial'),
(4, 'Parques y jardines',    'Incidencias en zonas verdes'),
(5, 'Transporte',            'Problemas de trafico y senalizacion'),
(6, 'Agua y saneamiento',    'Fugas o problemas de saneamiento'),
(7, 'Mobiliario urbano',     'Bancos, papeleras o elementos danados');
INSERT INTO Subcategoria (IdCategoria, Nombre, Descripcion, Icono, Prioridad) VALUES
(1, 'Farola apagada',      'Farola sin funcionamiento',      'lamp-off',    'Alta'),
(1, 'Parpadeo',            'Farola parpadeante',             'flashlight',  'Media'),
(1, 'Luz debil',           'Iluminacion insuficiente',       'sun-dim',     'Baja');
INSERT INTO Subcategoria (IdCategoria, Nombre, Descripcion, Icono, Prioridad) VALUES
(2, 'Acumulacion de basura','Residuos acumulados en via',    'trash-2',     'Media'),
(2, 'Contenedor desbordado','Contenedor lleno',              'trash-alt',   'Alta'),
(2, 'Grafiti',             'Marcas o pintadas',              'paint-brush', 'Baja');
INSERT INTO Subcategoria (IdCategoria, Nombre, Descripcion, Icono, Prioridad) VALUES
(3, 'Baches',              'Deterioro del asfalto',          'alert-circle','Alta'),
(3, 'Rotura de tuberia',   'Rotura de agua o saneamiento',   'water',       'Urgente'),
(3, 'Socavon',             'Hundimiento del terreno',        'alert-triangle','Urgente'),
(3, 'Pavimento danado',    'Losa o adoquin roto',            'square',      'Media');
INSERT INTO Subcategoria (IdCategoria, Nombre, Descripcion, Icono, Prioridad) VALUES
(4, 'Arbol caido',         'Arbol derribado',                'tree',        'Urgente'),
(4, 'Rama peligrosa',      'Rama partida o colgante',        'alert-circle','Alta'),
(4, 'Zona desaseada',      'Parque con suciedad',            'trash-2',     'Media'),
(4, 'Equipo infantil danado','Juego roto o peligroso',      'child',       'Alta');
INSERT INTO Subcategoria (IdCategoria, Nombre, Descripcion, Icono, Prioridad) VALUES
(5, 'Senal de trafico',    'Senal caida o deteriorada',      'alert-triangle','Alta'),
(5, 'Semaforo danado',     'Semaforo no funciona',           'light',       'Urgente'),
(5, 'Linea de pintura',    'Marcas viales borradas',         'edit-3',      'Media'),
(5, 'Obstaculo en via',    'Objeto que impide el paso',      'alert-circle','Alta');
INSERT INTO Subcategoria (IdCategoria, Nombre, Descripcion, Icono, Prioridad) VALUES
(6, 'Fuga de agua potable','Agua limpia derramada',          'water',       'Urgente'),
(6, 'Fuga de alcantarilla','Agua residual',                  'alert-circle','Urgente'),
(6, 'Boca de riego',       'Grifo de riego danado',          'droplet',     'Media'),
(6, 'Inundacion',          'Zona encharcada',                'clouds-rain', 'Urgente');
INSERT INTO Subcategoria (IdCategoria, Nombre, Descripcion, Icono, Prioridad) VALUES
(7, 'Banco danado',        'Banco roto o deteriorado',       'square',      'Baja'),
(7, 'Papelera rota',       'Papelera danada',                'trash-2',     'Media'),
(7, 'Macetero roto',       'Maceta o jardinera danada',      'flower-2',    'Baja'),
(7, 'Fuente apagada',      'Fuente sin agua',                'water',       'Baja');
INSERT INTO Incidencia (IdIncidencia, Titulo, Descripcion, FechaCreacion, FechaCierre, Estado, Prioridad, Direccion, IdUsuarioCreador, IdCategoria, IdSubcategoria, IdServicio, IdTecnicoAsignado)
VALUES
(1,  'Farola apagada en Calle Mayor',        'La farola del numero 15 de Calle Mayor lleva mas de una semana sin funcionar. Representa un riesgo por la escasa visibilidad nocturna.',                       '2024-06-01', '2024-06-03', 'Solucionada', 'Urgente', 'Calle Mayor 15, Pozuelo de Alarcon',              1, 1, 1, 1, 3),
(2,  'Bache peligroso frente al colegio',    'Existe un bache de gran tamano en el carril derecho de Avenida Andalucia a la altura del colegio. Varios vehiculos han sufrido danos.',                       '2024-10-12', NULL,         'En proceso',  'Urgente', 'Avenida Andalucia 22, Pozuelo de Alarcon',        2, 3, 8, 3, 6),
(3,  'Contenedor desbordado en Calle Sol',   'El contenedor de basura organica de Calle Sol lleva tres dias sin ser recogido. Genera malos olores y dificulta el paso de peatones.',                        '2025-02-18', '2025-02-20', 'Solucionada', 'Media',   'Calle Sol 8, Pozuelo de Alarcon',                 1, 2, 5, 2, 4),
(4,  'Banco roto en Parque Central',         'Uno de los bancos de la zona de descanso del Parque Central tiene el respaldo partido. Supone un riesgo de cortes para los usuarios.',                        '2025-07-05', NULL,         'Asignada',    'Media',   'Parque Central, Pozuelo de Alarcon',              2, 7, 25, 7, NULL),
(5,  'Fuga de agua en Calle Rio',            'Se observa una fuga de agua continua en la acera de Calle Rio. El agua discurre por la calzada y puede causar accidentes o danos en la infraestructura.',     '2025-11-11', NULL,         'En proceso',  'Urgente', 'Calle Rio 3, Pozuelo de Alarcon',                 1, 3, 9, 6, 6),
(6,  'Senal de stop caida en Calle Norte',   'La senal de stop situada en la interseccion de Calle Norte con Avenida Central ha caido al suelo, probablemente por el viento. Riesgo de accidente de trafico.','2026-01-20', NULL,        'Pendiente',   'Baja',    'Calle Norte 12, Pozuelo de Alarcon',              2, 5, 17, 5, NULL),
(7,  'Grafiti en fachada del ayuntamiento',  'La fachada lateral del edificio municipal amanecio cubierta de pintadas. Afecta a la imagen del espacio publico y requiere limpieza especializada.',           '2026-02-01', NULL,         'Pendiente',   'Media',   'Plaza de la Constitucion 1, Pozuelo de Alarcon',  1, 2, 7, 2, 4),
(8,  'Semaforo sin funcionar en Av. Europa', 'El semaforo del cruce de Avenida Europa con Calle Industria no enciende desde esta manana. Genera confusion y riesgo de colision entre vehiculos.',           '2026-03-10', NULL,         'En proceso',  'Urgente', 'Avenida Europa 45, Pozuelo de Alarcon',           2, 5, 18, 5, 3),
(9,  'Socavon en acera de Calle Pinar',      'Ha aparecido un socavon de aproximadamente 40 cm de diametro en la acera de Calle Pinar. Una persona mayor tropezo ayer. Requiere atencion urgente.',          '2026-03-18', NULL,         'Pendiente',   'Urgente', 'Calle Pinar 7, Pozuelo de Alarcon',               1, 3, 10, 3, NULL),
(10, 'Arbol caido tras tormenta',            'Un arbol de gran porte ha caido sobre la acera de Paseo del Parque bloqueando parcialmente la calzada. Los servicios de limpieza deben retirarlo.',            '2026-04-02', '2026-04-03', 'Solucionada', 'Urgente', 'Paseo del Parque 12, Pozuelo de Alarcon',         2, 4, 12, 4, 4),
(11, 'Papelera arrancada en Plaza Mayor',    'La papelera situada junto al banco numero 3 de Plaza Mayor ha sido arrancada de su anclaje. Hay residuos dispersos por el suelo de la plaza.',                '2026-04-08', NULL,         'Pendiente',   'Baja',    'Plaza Mayor, Pozuelo de Alarcon',                 1, 7, 26, 7, NULL));
INSERT INTO Imagen (IdImagen, RutaImagen, FechaSubida, IdIncidencia) VALUES
(1, '/imagenes/farola1.jpg',  '2024-06-01', 1),
(2, '/imagenes/bache1.jpg',   '2024-10-12', 2),
(3, '/imagenes/basura1.jpg',  '2025-02-18', 3),
(4, '/imagenes/banco1.jpg',   '2025-07-05', 4),
(5, '/imagenes/fuga1.jpg',    '2025-11-11', 5),
(6, '/imagenes/senal1.jpg',   '2026-01-20', 6),
(7, '/imagenes/grafiti1.jpg', '2026-02-01', 7);
INSERT INTO Actuacion (IdActuacion, DescripcionTrabajo, FechaInicio, FechaFin, MaterialesUtilizados, Observaciones, IdIncidencia, IdTecnico)
VALUES
(1, 'Reemplazo bombilla LED',               '2024-06-02', '2024-06-03', 'Bombilla LED 50W',   'Funcionamiento restaurado',   1, 3),
(2, 'Inspeccion y senalizacion provisional','2024-10-13', NULL,          'Conos de seguridad', 'Pendiente asfaltado',         2, 6),
(3, 'Retirada de residuos',                 '2025-02-19', '2025-02-20', 'Bolsa industrial',   'Zona limpia',                 3, 4),
(4, 'Revision inicial banco',               '2025-07-06', NULL,          'Ninguno',            'Pendiente sustitucion',       4, 6),
(5, 'Revision fuga',                        '2025-11-12', NULL,          'Llave paso',         'Necesita maquinaria pesada',  5, 6),
(6, 'Evaluacion senal',                     '2026-01-21', NULL,          'Soporte metalico',   'En espera de reposicion',     6, 3),
(7, 'Limpieza grafiti',                     '2026-02-02', NULL,          'Disolvente especial','Parcialmente eliminado',      7, 4);
INSERT INTO HistorialEstado (IdHistorial, EstadoAnterior, EstadoNuevo, FechaCambio, Comentario, IdIncidencia, IdUsuario)
VALUES
(1, 'Pendiente',  'En proceso',  '2024-06-02', 'Asignada a tecnico',     1, 5),
(2, 'En proceso', 'Solucionada', '2024-06-03', 'Trabajo completado',     1, 3),
(3, 'Pendiente',  'En proceso',  '2024-10-13', 'Revision iniciada',      2, 5),
(4, 'Pendiente',  'Solucionada', '2025-02-20', 'Incidencia solucionada', 3, 4),
(5, 'Pendiente',  'En proceso',  '2025-11-12', 'Fuga en reparacion',     5, 5),
(6, 'Pendiente',  'En proceso',  '2026-02-02', 'Grafiti en tratamiento', 7, 4),
(7, 'En proceso', 'Pendiente',   '2026-02-10', 'Pendiente confirmacion', 7, 5);
INSERT INTO HistorialEstado (EstadoAnterior, EstadoNuevo, Comentario, IdIncidencia, IdUsuario)
        VALUES (v_estado_actual, p_nuevo_estado, p_comentario, p_id_incidencia, p_id_usuario);
INSERT INTO HistorialEstado (EstadoAnterior, EstadoNuevo, Comentario, IdIncidencia, IdUsuario)
            VALUES (v_estado_actual,
                    IF(v_estado_actual = 'Pendiente', 'Asignada', v_estado_actual),
                    CONCAT('Tecnico asignado por gestor (IdUsuario=', p_id_gestor, ')'),
                    p_id_incidencia, p_id_gestor);
INSERT INTO HistorialEstado (EstadoAnterior, EstadoNuevo, Comentario, IdIncidencia, IdUsuario)
        VALUES (
            OLD.Estado,
            NEW.Estado,
            CONCAT('Cambio automatico via backend - usuario DB: ', USER()),
            NEW.IdIncidencia,
            NEW.IdUsuarioCreador
        );