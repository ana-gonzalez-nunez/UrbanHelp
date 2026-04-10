/**
 * COMPONENTES DE INTERFAZ
 */
function renderNavbar() {
  return `
    <nav class="bg-white/90 backdrop-blur border-b border-slate-200 shadow-sm sticky top-0 z-[1000]">
      <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="user.html" class="flex items-center gap-2 group">
          <div class="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
            <i data-lucide="layout-dashboard" class="w-5 h-5 text-white"></i>
          </div>
          <span class="font-bold text-slate-900 text-lg">Panel Ciudadano</span>
        </a>

        <div class="flex items-center gap-3">
          <a href="user.html" class="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold shadow-sm hover:bg-blue-700 transition-colors text-sm">
            <i data-lucide="arrow-left" class="w-4 h-4"></i>
            Ir al Panel
          </a>
          <div class="w-px h-6 bg-slate-200 mx-1"></div>
        </div>
      </div>
    </nav>
  `;
}

function historyItem(update, index, total) {
  const color = update.status === 'pendiente' ? 'bg-yellow-500 text-yellow-700' : 
                update.status === 'en-proceso' ? 'bg-blue-500 text-blue-700' : 
                'bg-green-500 text-green-700';

  const label = update.status === 'pendiente' ? 'Registrada' : 
                update.status === 'en-proceso' ? 'En Proceso' : 'Resuelta';

  return `
    <div class="relative pb-6 ${index === total - 1 ? 'last:pb-0' : ''}">
      ${index < total - 1 ? '<div class="absolute left-2 top-5 bottom-0 w-0.5 bg-slate-200"></div>' : ''}
      <div class="relative flex items-start gap-3">
        <div class="w-4 h-4 rounded-full mt-1 flex-shrink-0 ${color.split(' ')[0]}"></div>
        <div class="flex-1">
          <span class="text-sm font-medium ${color.split(' ')[1]}">${label}</span>
          <p class="text-xs text-slate-500 mb-1">${formatDate(update.date)}</p>
          ${update.comment ? `<p class="text-sm text-slate-700 bg-slate-50 p-2 rounded-lg mt-2 border border-slate-200">${update.comment}</p>` : ''}
        </div>
      </div>
    </div>
  `;
}

function renderIncidentDetail(incident) {
  return `
    ${renderNavbar()}
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="mb-8">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h1 class="text-3xl font-extrabold text-slate-900">${getCategoryLabel(incident.category)}</h1>
            <p class="text-slate-600 mt-1">Incidencia #${incident.id}</p>
          </div>
          ${getStatusBadge(incident.status)}
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 class="text-xl font-semibold text-slate-900 mb-4">Detalles</h2>
            <div class="space-y-4">
              <p class="text-slate-900">${incident.description}</p>
              <div class="flex items-center gap-2 text-slate-600 text-sm">
                <i data-lucide="map-pin" class="w-4 h-4"></i> ${incident.location}
              </div>
              <div id="incidentMapView" class="w-full rounded-xl border border-slate-200 overflow-hidden shadow-inner"></div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 class="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <i data-lucide="clock" class="w-5 h-5"></i> Historial
            </h2>
            <div class="relative">
              ${incident.statusHistory.map((upd, i) => historyItem(upd, i, incident.statusHistory.length)).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * LÓGICA DE MAPA E INICIALIZACIÓN
 */
function initMapView(incident) {
  const el = document.getElementById('incidentMapView');
  if (!el || typeof L === 'undefined' || !incident.geo) return;

  const map = L.map('incidentMapView', { zoomControl: true, scrollWheelZoom: false })
               .setView([incident.geo.lat, incident.geo.lng], 16);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  L.marker([incident.geo.lat, incident.geo.lng]).addTo(map).bindPopup(incident.location).openPopup();
}

function render() {
  const id = new URLSearchParams(window.location.search).get('id');
  const incident = mockIncidents.find(i => i.id === id);
  const app = document.getElementById('app');

  if (!incident) {
    app.innerHTML = `<div class="p-20 text-center"><h2>No encontrada</h2><a href="user.html">Volver</a></div>`;
    return;
  }

  app.innerHTML = renderIncidentDetail(incident);
  
  if (window.lucide) window.lucide.createIcons();
  initMapView(incident);
}

document.addEventListener('DOMContentLoaded', render);