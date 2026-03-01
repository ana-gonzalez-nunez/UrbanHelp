const mockIncidents = [
  {
    id: 'U001',
    category: 'alumbrado',
    description: 'Farola apagada frente al portal principal desde hace tres noches.',
    location: 'Calle Mayor, 45',
    status: 'pendiente',
    createdAt: '2026-02-26T18:30:00',
    technicianComments: [],
    statusHistory: [
      { id: 'H1', status: 'pendiente', date: '2026-02-26T18:30:00', comment: 'Incidencia registrada por ciudadano.' }
    ]
  },
  {
    id: 'U002',
    category: 'via-publica',
    description: 'Bache profundo en carril derecho que dificulta el tránsito.',
    location: 'Avenida Libertad, km 2.3',
    status: 'en-proceso',
    createdAt: '2026-02-24T09:10:00',
    technicianComments: [
      'Se realizó inspección inicial y se señalizó temporalmente la zona.'
    ],
    statusHistory: [
      { id: 'H1', status: 'pendiente', date: '2026-02-24T09:10:00', comment: 'Incidencia registrada por ciudadano.' },
      { id: 'H2', status: 'en-proceso', date: '2026-02-25T08:45:00', comment: 'Equipo técnico asignado y diagnóstico en curso.' }
    ]
  },
  {
    id: 'U003',
    category: 'limpieza',
    description: 'Contenedores desbordados en la plaza desde el fin de semana.',
    location: 'Plaza España',
    status: 'resuelta',
    createdAt: '2026-02-20T12:00:00',
    technicianComments: [
      'Servicio de limpieza ejecutado y zona desinfectada.'
    ],
    statusHistory: [
      { id: 'H1', status: 'pendiente', date: '2026-02-20T12:00:00', comment: 'Incidencia registrada por ciudadano.' },
      { id: 'H2', status: 'en-proceso', date: '2026-02-20T14:20:00', comment: 'Solicitud enviada al servicio de limpieza.' },
      { id: 'H3', status: 'resuelta', date: '2026-02-20T17:10:00', comment: 'Recogida completada y punto verificado.' }
    ]
  },
  {
    id: 'U004',
    category: 'parques-jardines',
    description: 'Ramas bajas obstruyen el paso peatonal en sendero principal.',
    location: 'Parque Central - Zona Norte',
    status: 'en-proceso',
    createdAt: '2026-02-27T10:05:00',
    technicianComments: [
      'Poda programada para el siguiente turno de mantenimiento.'
    ],
    statusHistory: [
      { id: 'H1', status: 'pendiente', date: '2026-02-27T10:05:00', comment: 'Incidencia registrada por ciudadano.' },
      { id: 'H2', status: 'en-proceso', date: '2026-02-27T12:10:00', comment: 'Área acordonada y orden de trabajo abierta.' }
    ]
  },
  {
    id: 'U005',
    category: 'mobiliario-urbano',
    description: 'Papelera rota y con bordes cortantes cerca de la parada de bus.',
    location: 'Plaza Mayor',
    status: 'pendiente',
    createdAt: '2026-02-28T08:40:00',
    technicianComments: [],
    statusHistory: [
      { id: 'H1', status: 'pendiente', date: '2026-02-28T08:40:00', comment: 'Incidencia registrada por ciudadano.' }
    ]
  }
];

function getCategoryLabel(category) {
  const categories = {
    alumbrado: 'Alumbrado Público',
    limpieza: 'Limpieza',
    'via-publica': 'Vía Pública',
    'vias-publicas': 'Vías Públicas',
    'mobiliario-urbano': 'Mobiliario Urbano',
    'parques-jardines': 'Parques y Jardines',
    transporte: 'Transporte',
    infraestructura: 'Servicios e Infraestructura'
  };

  return categories[category] || category;
}

function getStatusBadge(status) {
  if (status === 'pendiente') {
    return '<span class="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">Pendiente</span>';
  }

  if (status === 'en-proceso') {
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
