/**
 * ESTADO Y VARIABLES GLOBALES
 */
let imageName = '';
let selectedCoords = null;
let mapInstance = null;
let marker = null;

/**
 * COMPONENTES DE INTERFAZ (HTML Dinámico)
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
            Volver al Panel
          </a>
          <div class="w-px h-6 bg-slate-200 mx-1"></div>
        </div>
      </div>
    </nav>
  `;
}

function renderForm() {
  const categories = ['limpieza', 'alumbrado', 'vias-publicas', 'transporte', 'mobiliario-urbano'];
  
  return `
    ${renderNavbar()}
    <div class="max-w-3xl mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-slate-900 text-center">Registrar Nueva Incidencia</h1>
        <p class="text-slate-600 mt-2 text-center">Reporta problemas en la vía pública para su resolución</p>
      </div>

      <form id="newIncidentForm" class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div class="mb-6">
          <label class="block text-sm font-medium text-slate-900 mb-2">Categoría *</label>
          <select id="category" required class="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500">
            <option value="">Selecciona una categoría</option>
            ${categories.map(cat => `<option value="${cat}">${getCategoryLabel(cat)}</option>`).join('')}
          </select>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-slate-900 mb-2">Descripción del problema *</label>
          <textarea id="description" required rows="4" class="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-slate-900 mb-2">Dirección aproximada *</label>
          <div class="relative">
            <i data-lucide="map-pin" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"></i>
            <input id="location" type="text" required class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-slate-900 mb-2">Ubicación exacta en el mapa *</label>
          <div id="incidentMap" class="w-full rounded-xl border border-slate-300 overflow-hidden shadow-inner"></div>
          <p id="selectedPoint" class="text-sm text-slate-500 mt-2 italic">Haz clic en el mapa para fijar el punto.</p>
        </div>

        <button type="submit" class="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700 transition-all font-bold shadow-md">
          <i data-lucide="send" class="w-5 h-5"></i>
          Enviar Reporte
        </button>
      </form>
    </div>
  `;
}

/**
 * LÓGICA DEL MAPA (Leaflet)
 */
function initMapPicker() {
  const mapElement = document.getElementById('incidentMap');
  if (!mapElement || typeof L === 'undefined') return;

  mapInstance = L.map('incidentMap').setView([40.4168, -3.7038], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OSM' }).addTo(mapInstance);

  mapInstance.on('click', (e) => {
    const { lat, lng } = e.latlng;
    selectedCoords = { lat: lat.toFixed(6), lng: lng.toFixed(6) };
    if (marker) marker.setLatLng(e.latlng);
    else marker = L.marker(e.latlng).addTo(mapInstance);
    document.getElementById('selectedPoint').textContent = `Coordenadas: ${selectedCoords.lat}, ${selectedCoords.lng}`;
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(p => mapInstance.setView([p.coords.latitude, p.coords.longitude], 15));
  }
}

/**
 * GESTIÓN DE EVENTOS
 */
function bindEvents() {
  // Envío de formulario
  document.getElementById('newIncidentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (!selectedCoords) return alert('Por favor, selecciona un punto en el mapa.');

    const profile = window.getUserProfile ? getUserProfile() : {};
    const now = new Date().toISOString();
    
    const newIncident = {
      id: `INC${Date.now().toString().slice(-3)}`, // ID Temporal
      category: getCategoryLabel(document.getElementById('category').value),
      description: document.getElementById('description').value.trim(),
      location: document.getElementById('location').value.trim(),
      geo: selectedCoords,
      status: 'pendiente',
      createdAt: now,
      citizenName: profile.fullName || 'Ciudadano'
    };

    if (window.addIncident) window.addIncident(newIncident);
    else window.mockIncidents = [newIncident, ...(window.mockIncidents || [])];

    // Feedback de éxito y redirección
    document.getElementById('app').innerHTML = `<div class="p-20 text-center"><h2 class="text-2xl font-bold text-green-600">¡Incidencia registrada! Volviendo al panel...</h2></div>`;
    setTimeout(() => window.location.href = 'user.html', 1500);
  });
}

/**
 * INICIALIZACIÓN
 */
function render() {
  document.getElementById('app').innerHTML = renderForm();
  if (window.lucide) window.lucide.createIcons();
  initMapPicker();
  bindEvents();
}

render();