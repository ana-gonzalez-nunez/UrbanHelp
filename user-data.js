const mockIncidents = [
  {
    id: 'INC001',
    title: 'Farola fundida en Calle Mayor',
    category: 'Alumbrado público',
    description: 'La farola número 45 de Calle Mayor no funciona desde hace una semana. Se requiere cambio de bombilla o revisión de circuito.',
    location: 'Calle Mayor, 45',
    status: 'en-proceso',
    priority: 'alta',
    createdAt: '2026-02-20T10:30:00',
    reportDate: '2026-02-20',
    assignedDate: '2026-02-21',
    citizenName: 'María García López',
    citizenEmail: 'maria.garcia@email.com',
    citizenPhone: '+34 612 345 678',
    assignedTechnician: 'Carlos Rodríguez',
    technicianComments: ['Se realizó inspección inicial y se detectó bombilla dañada.'],
    actions: [
      { id: 'A1', date: '27/02/2026 10:30', technician: 'Carlos Rodríguez', action: 'Incidencia asignada', comment: 'Se procede a la inspección del sitio' },
      { id: 'A2', date: '27/02/2026 11:00', technician: 'Carlos Rodríguez', action: 'Inspección inicial realizada', comment: 'Confirmado fallo de bombilla. Se requiere reemplazo.' }
    ],
    statusHistory: [
      { id: 'H1', status: 'pendiente', date: '2026-02-20T10:30:00', comment: 'Incidencia registrada por ciudadano.' },
      { id: 'H2', status: 'en-proceso', date: '2026-02-21T08:45:00', comment: 'Asignada al equipo técnico.' }
    ]
  },
  {
    id: 'INC002',
    title: 'Contenedores desbordados',
    category: 'Limpieza',
    description: 'Los contenedores de basura en Plaza España llevan varios días sin recoger.',
    location: 'Plaza España',
    status: 'resuelta',
    priority: 'alta',
    createdAt: '2026-02-18T09:30:00',
    reportDate: '2026-02-18',
    assignedDate: '2026-02-18',
    citizenName: 'Juan Martínez',
    citizenEmail: 'juan@email.com',
    citizenPhone: '+34 612 345 679',
    assignedTechnician: 'Ana Fernández',
    technicianComments: ['Servicio completado y zona saneada.'],
    actions: [
      { id: 'A1', date: '18/02/2026 09:30', technician: 'Ana Fernández', action: 'Servicio de limpieza solicitado', comment: 'Se contactó con el servicio de limpieza' },
      { id: 'A2', date: '18/02/2026 14:00', technician: 'Ana Fernández', action: 'Incidencia resuelta', comment: 'Contenedores vaciados y zona limpiada' }
    ],
    statusHistory: [
      { id: 'H1', status: 'pendiente', date: '2026-02-18T09:30:00', comment: 'Incidencia registrada por ciudadano.' },
      { id: 'H2', status: 'en-proceso', date: '2026-02-18T10:00:00', comment: 'Equipo de limpieza avisado.' },
      { id: 'H3', status: 'resuelta', date: '2026-02-18T14:00:00', comment: 'Incidencia solucionada.' }
    ]
  },
  {
    id: 'INC003',
    title: 'Banco roto en el Retiro',
    category: 'Mobiliario urbano',
    description: 'Banco de madera roto y con riesgo de astillas en la zona infantil.',
    location: 'Parque del Retiro',
    status: 'pendiente',
    priority: 'media',
    createdAt: '2026-02-24T12:00:00',
    reportDate: '2026-02-24',
    assignedDate: null,
    citizenName: 'Laura Pérez',
    citizenEmail: 'laura@email.com',
    citizenPhone: '+34 612 345 680',
    assignedTechnician: null,
    technicianComments: [],
    actions: [],
    statusHistory: [
      { id: 'H1', status: 'pendiente', date: '2026-02-24T12:00:00', comment: 'Pendiente de asignación.' }
    ]
  },
  {
    id: 'INC004',
    title: 'Bache en Av. Libertad',
    category: 'Vía pública',
    description: 'Bache de gran tamaño en el carril derecho que pone en riesgo los vehículos.',
    location: 'Avenida Libertad, km 2.3',
    status: 'en-proceso',
    priority: 'alta',
    createdAt: '2026-02-21T08:30:00',
    reportDate: '2026-02-21',
    assignedDate: '2026-02-22',
    citizenName: 'Pedro González',
    citizenEmail: 'pedro@email.com',
    citizenPhone: '+34 612 345 681',
    assignedTechnician: 'Miguel Ángel Torres',
    technicianComments: ['Se requiere asfaltado completo de la zona.'],
    actions: [
      { id: 'A1', date: '22/02/2026 08:30', technician: 'Miguel Ángel Torres', action: 'Inspección del bache completada', comment: 'Bache mide aproximadamente 50cm. Se requiere asfaltado completo de la zona.' }
    ],
    statusHistory: [
      { id: 'H1', status: 'pendiente', date: '2026-02-21T08:30:00', comment: 'Incidencia registrada.' },
      { id: 'H2', status: 'en-proceso', date: '2026-02-22T08:30:00', comment: 'Inspección técnica realizada.' }
    ]
  },
  {
    id: 'INC005',
    title: 'Grifería sin agua en parque infantil',
    category: 'Parques y jardines',
    description: 'Las fuentes de agua del parque infantil no están funcionando.',
    location: 'Parque Infantil - Zona Norte',
    status: 'en-proceso',
    priority: 'media',
    createdAt: '2026-02-25T13:00:00',
    reportDate: '2026-02-25',
    assignedDate: '2026-02-25',
    citizenName: 'Roberto Sánchez',
    citizenEmail: 'robert@email.com',
    citizenPhone: '+34 612 345 682',
    assignedTechnician: 'Carlos Rodríguez',
    technicianComments: ['Se reabrió válvula; pendiente verificación final.'],
    actions: [
      { id: 'A1', date: '25/02/2026 13:00', technician: 'Carlos Rodríguez', action: 'Inspección inicial', comment: 'Válvula de corte cerrada. Se reabrió el suministro' }
    ],
    statusHistory: [
      { id: 'H1', status: 'pendiente', date: '2026-02-25T13:00:00', comment: 'Incidencia registrada.' },
      { id: 'H2', status: 'en-proceso', date: '2026-02-25T13:30:00', comment: 'En seguimiento por técnico.' }
    ]
  },
  {
    id: 'INC006',
    title: 'Cartel publicitario desprendido',
    category: 'Mobiliario urbano',
    description: 'Un cartel publicitario se desprendió en la zona comercial.',
    location: 'Calle Comercio, 23',
    status: 'resuelta',
    priority: 'alta',
    createdAt: '2026-02-19T15:30:00',
    reportDate: '2026-02-19',
    assignedDate: '2026-02-19',
    citizenName: 'Susana López',
    citizenEmail: 'susana@email.com',
    citizenPhone: '+34 612 345 683',
    assignedTechnician: 'Miguel Ángel Torres',
    technicianComments: ['Cartel asegurado y riesgo eliminado.'],
    actions: [
      { id: 'A1', date: '19/02/2026 15:30', technician: 'Miguel Ángel Torres', action: 'Cartel asegurado', comment: 'Cartel colocado correctamente y anclado' },
      { id: 'A2', date: '19/02/2026 16:00', technician: 'Miguel Ángel Torres', action: 'Control de seguridad', comment: 'Zona verificada sin peligros' }
    ],
    statusHistory: [
      { id: 'H1', status: 'pendiente', date: '2026-02-19T15:30:00', comment: 'Incidencia registrada.' },
      { id: 'H2', status: 'en-proceso', date: '2026-02-19T15:45:00', comment: 'Reparación iniciada.' },
      { id: 'H3', status: 'resuelta', date: '2026-02-19T16:00:00', comment: 'Incidencia cerrada.' }
    ]
  },
  {
    id: 'INC007',
    title: 'Árbol caído en Parque Central',
    category: 'Parques y jardines',
    description: 'Árbol de gran tamaño caído que bloquea paso peatonal.',
    location: 'Parque Central - Entrada Sur',
    status: 'en-proceso',
    priority: 'alta',
    createdAt: '2026-02-26T10:00:00',
    reportDate: '2026-02-26',
    assignedDate: '2026-02-26',
    citizenName: 'Francisco Ruiz',
    citizenEmail: 'francisco@email.com',
    citizenPhone: '+34 612 345 684',
    assignedTechnician: 'Ana Fernández',
    technicianComments: ['Equipo desplegado para retirada de ramas.'],
    actions: [
      { id: 'A1', date: '26/02/2026 10:00', technician: 'Ana Fernández', action: 'Se desplegó el equipo', comment: 'Maderera solicitada para limpieza de árbol' }
    ],
    statusHistory: [
      { id: 'H1', status: 'pendiente', date: '2026-02-26T10:00:00', comment: 'Incidencia registrada.' },
      { id: 'H2', status: 'en-proceso', date: '2026-02-26T10:30:00', comment: 'Equipo en terreno.' }
    ]
  },
  {
    id: 'INC008',
    title: 'Semáforo amarillo siempre encendido',
    category: 'Alumbrado público',
    description: 'El semáforo en la intersección de Av. Principal no cambia de color.',
    location: 'Av. Principal - Calle 5',
    status: 'pendiente',
    priority: 'media',
    createdAt: '2026-02-26T11:20:00',
    reportDate: '2026-02-26',
    assignedDate: null,
    citizenName: 'Ángel Moreno',
    citizenEmail: 'angel@email.com',
    citizenPhone: '+34 612 345 685',
    assignedTechnician: null,
    technicianComments: [],
    actions: [],
    statusHistory: [
      { id: 'H1', status: 'pendiente', date: '2026-02-26T11:20:00', comment: 'Pendiente de asignación.' }
    ]
  },
  {
    id: 'INC009',
    title: 'Fugas de agua en Calle Norte',
    category: 'Servicios e infraestructura',
    description: 'Se detectó fuga importante de agua potable en la acera.',
    location: 'Calle Norte, 156',
    status: 'resuelta',
    priority: 'alta',
    createdAt: '2026-02-15T11:30:00',
    reportDate: '2026-02-15',
    assignedDate: '2026-02-15',
    citizenName: 'Valentina Costa',
    citizenEmail: 'valentina@email.com',
    citizenPhone: '+34 612 345 686',
    assignedTechnician: 'Miguel Ángel Torres',
    technicianComments: ['Fuga sellada y servicio restablecido.'],
    actions: [
      { id: 'A1', date: '15/02/2026 11:30', technician: 'Miguel Ángel Torres', action: 'Tubería reparada', comment: 'Fuga sellada correctamente' },
      { id: 'A2', date: '15/02/2026 12:00', technician: 'Miguel Ángel Torres', action: 'Prueba de funcionamiento', comment: 'Sistema funcionando correctamente' }
    ],
    statusHistory: [
      { id: 'H1', status: 'pendiente', date: '2026-02-15T11:30:00', comment: 'Incidencia registrada.' },
      { id: 'H2', status: 'en-proceso', date: '2026-02-15T11:40:00', comment: 'Reparación iniciada.' },
      { id: 'H3', status: 'resuelta', date: '2026-02-15T12:00:00', comment: 'Incidencia cerrada.' }
    ]
  },
  {
    id: 'INC010',
    title: 'Papelera rota en plaza',
    category: 'Mobiliario urbano',
    description: 'Papelera pública rota y sin posibilidad de uso normal.',
    location: 'Plaza Mayor',
    status: 'pendiente',
    priority: 'baja',
    createdAt: '2026-02-25T08:40:00',
    reportDate: '2026-02-25',
    assignedDate: null,
    citizenName: 'Dolores Ruiz',
    citizenEmail: 'dolores@email.com',
    citizenPhone: '+34 612 345 687',
    assignedTechnician: null,
    technicianComments: [],
    actions: [],
    statusHistory: [
      { id: 'H1', status: 'pendiente', date: '2026-02-25T08:40:00', comment: 'Pendiente de asignación.' }
    ]
  },
  {
    id: 'INC011',
    title: 'Grietas en acera peatonal',
    category: 'Vía pública',
    description: 'Grietas peligrosas detectadas en la acera de la zona residencial.',
    location: 'Calle Residencial, 34',
    status: 'en-proceso',
    priority: 'media',
    createdAt: '2026-02-23T09:00:00',
    reportDate: '2026-02-23',
    assignedDate: '2026-02-24',
    citizenName: 'Guillermo Torres',
    citizenEmail: 'guillermo@email.com',
    citizenPhone: '+34 612 345 688',
    assignedTechnician: 'Carlos Rodríguez',
    technicianComments: ['Grietas evaluadas, pendiente intervención de obra civil.'],
    actions: [
      { id: 'A1', date: '24/02/2026 09:00', technician: 'Carlos Rodríguez', action: 'Inspección realizada', comment: 'Grietas de 2-3cm detectadas' }
    ],
    statusHistory: [
      { id: 'H1', status: 'pendiente', date: '2026-02-23T09:00:00', comment: 'Incidencia registrada.' },
      { id: 'H2', status: 'en-proceso', date: '2026-02-24T09:00:00', comment: 'En revisión técnica.' }
    ]
  },
  {
    id: 'INC012',
    title: 'Jardinería necesaria - Poda urgente',
    category: 'Parques y jardines',
    description: 'Árboles necesitan poda urgente para evitar ramas peligrosas.',
    location: 'Avenida Arboleda',
    status: 'resuelta',
    priority: 'media',
    createdAt: '2026-02-14T08:00:00',
    reportDate: '2026-02-14',
    assignedDate: '2026-02-14',
    citizenName: 'Elena García',
    citizenEmail: 'elena@email.com',
    citizenPhone: '+34 612 345 689',
    assignedTechnician: 'Ana Fernández',
    technicianComments: ['Poda completada y zona asegurada.'],
    actions: [
      { id: 'A1', date: '14/02/2026 08:00', technician: 'Ana Fernández', action: 'Poda completada', comment: 'Todos los árboles podados correctamente' }
    ],
    statusHistory: [
      { id: 'H1', status: 'pendiente', date: '2026-02-14T08:00:00', comment: 'Incidencia registrada.' },
      { id: 'H2', status: 'en-proceso', date: '2026-02-14T08:15:00', comment: 'Trabajo de poda iniciado.' },
      { id: 'H3', status: 'resuelta', date: '2026-02-14T10:00:00', comment: 'Incidencia cerrada.' }
    ]
  }
];

function getCategoryLabel(category) {
  const categories = {
    alumbrado: 'Alumbrado público',
    limpieza: 'Limpieza',
    'via-publica': 'Vía pública',
    'vias-publicas': 'Vía pública',
    'mobiliario-urbano': 'Mobiliario urbano',
    'parques-jardines': 'Parques y jardines',
    transporte: 'Transporte',
    infraestructura: 'Servicios e infraestructura'
  };

  return categories[category] || category;
}

function getStatusBadge(status) {
  if (status === 'pendiente') {
    return '<span class="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">Pendiente</span>';
  }

  if (status === 'en-proceso' || status === 'en proceso') {
    return '<span class="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">En Proceso</span>';
  }

  return '<span class="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">Resuelta</span>';
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function renderIncidentCard(incident) {
  return `
    <a href="user-incidencia-detalle.html?id=${encodeURIComponent(incident.id)}" class="group block bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-blue-300 transition-all duration-200">
      <div class="flex items-start justify-between gap-3 mb-2">
        <div>
          <h3 class="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">${getCategoryLabel(incident.category)}</h3>
          <p class="text-xs text-slate-500 mt-1">Incidencia #${incident.id}</p>
        </div>
        ${getStatusBadge(incident.status)}
      </div>
      <p class="text-slate-700 mt-2">${incident.description}</p>
      <div class="mt-4 flex flex-wrap items-center gap-5 text-sm text-slate-500">
        <span class="inline-flex items-center gap-2">
          <i data-lucide="calendar" class="w-4 h-4"></i>
          ${new Date(incident.createdAt).toLocaleDateString('es-ES')}
        </span>
        <span class="inline-flex items-center gap-2">
          <i data-lucide="map-pin" class="w-4 h-4"></i>
          ${incident.location}
        </span>
      </div>
    </a>
  `;
}

const INCIDENTS_STORAGE_KEY = 'urbanIncidents';

function loadStoredIncidents() {
  try {
    const stored = localStorage.getItem(INCIDENTS_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getIncidents() {
  const storedIncidents = loadStoredIncidents();
  if (storedIncidents.length > 0) {
    return storedIncidents;
  }
  return [...mockIncidents];
}

function saveIncidents(incidents) {
  try {
    localStorage.setItem(INCIDENTS_STORAGE_KEY, JSON.stringify(incidents));
  } catch {
    // localStorage not available; continue in-memory only
  }
  window.mockIncidents = incidents;
}

function addIncident(incident) {
  const currentIncidents = getIncidents();
  const updatedIncidents = [incident, ...currentIncidents];
  saveIncidents(updatedIncidents);
  return incident;
}

function getIncidentMapUrl(incident) {
  if (incident && incident.geo && typeof incident.geo.lat === 'number' && typeof incident.geo.lng === 'number') {
    return `https://www.google.com/maps?q=${incident.geo.lat},${incident.geo.lng}`;
  }

  if (incident && incident.location) {
    return `https://www.google.com/maps?q=${encodeURIComponent(incident.location)}`;
  }

  return 'https://www.google.com/maps';
}

try {
  window.mockIncidents = getIncidents();
} catch {
  window.mockIncidents = mockIncidents.slice();
}
window.getIncidents = getIncidents;
window.saveIncidents = saveIncidents;
window.addIncident = addIncident;
window.getIncidentMapUrl = getIncidentMapUrl;

const defaultUserProfile = {
  id: 'USR001',
  fullName: 'María García López',
  email: 'maria.garcia@email.com',
  phone: '+34 612 345 678',
  address: 'Calle Mayor, 45',
  postalCode: '28013',
  city: 'Madrid',
  notificationsEnabled: true
};

function getUserProfile() {
  const stored = localStorage.getItem('userProfile');
  if (!stored) {
    return { ...defaultUserProfile };
  }

  try {
    return { ...defaultUserProfile, ...JSON.parse(stored) };
  } catch {
    return { ...defaultUserProfile };
  }
}

function saveUserProfile(profile) {
  localStorage.setItem('userProfile', JSON.stringify(profile));
}

window.defaultUserProfile = defaultUserProfile;
window.getUserProfile = getUserProfile;
window.saveUserProfile = saveUserProfile;
