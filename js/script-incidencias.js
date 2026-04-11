/**
 * ESTADO GLOBAL
 */
let selectedFilter = 'todas';

/**
 * COMPONENTES DE INTERFAZ
 */
function renderNavbar() {
  return `
    <nav class="bg-white/90 backdrop-blur border-b border-slate-200 shadow-sm sticky top-0 z-50">
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
          <button id="logoutBtn" class="flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-all font-semibold text-sm">
            <i data-lucide="log-out" class="w-4 h-4"></i>
            <span>Salir</span>
          </button>
        </div>
      </div>
    </nav>
  `;
}

function getFilterButtonClass(value) {
  if (selectedFilter === value) {
    if (value === 'pendiente') return 'bg-yellow-600 text-white';
    if (value === 'en-proceso') return 'bg-blue-600 text-white';
    if (value === 'resuelta') return 'bg-green-600 text-white';
    return 'bg-blue-600 text-white';
  }
  return 'bg-slate-100 text-slate-700 hover:bg-slate-200';
}

/**
 * LÓGICA DE RENDERIZADO
 */
function renderPageContent() {
  const incidents = window.mockIncidents || [];
  const pending = incidents.filter(i => i.status === 'pendiente').length;
  const inProgress = incidents.filter(i => i.status === 'en-proceso').length;
  const resolved = incidents.filter(i => i.status === 'resuelta').length;

  return `
    ${renderNavbar()}
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-slate-900">Historial de Incidencias</h1>
        <p class="text-slate-600 mt-2">Consulta todas tus incidencias reportadas</p>
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-sm">
        <div class="flex items-center gap-2 mb-3">
          <i data-lucide="filter" class="w-5 h-5 text-slate-600"></i>
          <h2 class="font-semibold text-slate-900">Filtrar por estado</h2>
        </div>
        <div class="flex flex-wrap gap-2">
          <button onclick="setFilter('todas')" class="px-4 py-2 rounded-xl font-semibold shadow-sm transition-colors ${getFilterButtonClass('todas')}">Todas (${incidents.length})</button>
          <button onclick="setFilter('pendiente')" class="px-4 py-2 rounded-xl font-semibold shadow-sm transition-colors ${getFilterButtonClass('pendiente')}">Pendientes (${pending})</button>
          <button onclick="setFilter('en-proceso')" class="px-4 py-2 rounded-xl font-semibold shadow-sm transition-colors ${getFilterButtonClass('en-proceso')}">En Proceso (${inProgress})</button>
          <button onclick="setFilter('resuelta')" class="px-4 py-2 rounded-xl font-semibold shadow-sm transition-colors ${getFilterButtonClass('resuelta')}">Resueltas (${resolved})</button>
        </div>
      </div>

      <div class="space-y-4" id="incidentsList"></div>
    </div>
  `;
}

function renderList() {
  const incidents = window.mockIncidents || [];
  const filtered = selectedFilter === 'todas'
    ? incidents
    : incidents.filter(i => i.status === selectedFilter);

  const listContainer = document.getElementById('incidentsList');
  if (filtered.length === 0) {
    listContainer.innerHTML = `
      <div class="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
        <p class="text-slate-600">No se encontraron incidencias con este filtro</p>
      </div>
    `;
    return;
  }

  // Se asume que renderIncidentCard está definida en user-data.js
  if (typeof renderIncidentCard === 'function') {
    listContainer.innerHTML = filtered.map(renderIncidentCard).join('');
  }
}

/**
 * ACCIONES
 */
window.setFilter = function(filter) {
  selectedFilter = filter;
  render();
};

function setupLogout() {
  const btn = document.getElementById('logoutBtn');
  if (btn) {
    btn.addEventListener('click', async () => {
      const confirmed = window.confirmLogoutModal
        ? await window.confirmLogoutModal({
            title: 'Cerrar sesion',
            message: '¿Deseas cerrar sesion ahora?',
            confirmText: 'Si, cerrar',
            cancelText: 'Cancelar'
          })
        : confirm("¿Deseas cerrar sesión?");

      if (confirmed) {
        window.location.href = 'login.html';
      }
    });
  }
}

/**
 * INICIALIZACIÓN
 */
function render() {
  document.getElementById('app').innerHTML = renderPageContent();
  renderList();
  setupLogout();
  if (window.lucide) window.lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', render);