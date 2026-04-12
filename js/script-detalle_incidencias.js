/**
 * RENDERIZADO DEL HTML
 */
function renderIncidentDetail(incident) {
    return `
        <nav class="bg-white/90 backdrop-blur border-b border-slate-200 shadow-sm sticky top-0 z-[1000]">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <a href="tecnico.html" class="flex items-center gap-2 group">
                        <div class="bg-indigo-600 p-1.5 rounded-lg">
                            <i data-lucide="wrench" class="w-5 h-5 text-white"></i>
                        </div>
                        <span class="font-bold text-slate-900 text-lg">Panel Técnico</span>
                    </a>
                </div>
                <div class="flex items-center gap-3">
                    <a href="tecnico.html" class="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold text-sm">
                        <i data-lucide="arrow-left" class="w-4 h-4"></i> Ir al Listado
                    </a>
                </div>
            </div>
        </nav>

        <div class="max-w-7xl mx-auto space-y-6 pt-8 pb-20 px-4 sm:px-6">
            <div class="bg-white rounded-2xl shadow-xl border border-slate-200/70 p-6 flex justify-between items-center">
                <h1 class="text-2xl font-extrabold text-slate-900">Incidencia #${incident.id}</h1>
                <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold border border-blue-200">
                    ${incident.status.toUpperCase()}
                </span>
            </div>

            <div class="grid gap-6 lg:grid-cols-3">
                <div class="lg:col-span-2 space-y-6">
                    <div class="bg-white rounded-2xl shadow-lg border border-slate-200/70 p-6">
                        <h3 class="text-xl font-bold mb-4">Descripción</h3>
                        <p class="text-slate-700 leading-relaxed">${incident.description}</p>
                        <div class="mt-4 flex items-center gap-2 text-slate-500 text-sm">
                            <i data-lucide="map-pin" class="w-4 h-4"></i> ${incident.location}
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl shadow-lg border border-slate-200/70 overflow-hidden">
                        <div class="bg-slate-50 border-b p-4 font-bold text-slate-700 flex items-center gap-2">
                            <i data-lucide="map" class="w-4 h-4"></i> Ubicación Geográfica
                        </div>
                        <div id="incidentMapDetail" style="height: 400px; width: 100%; background: #f1f5f9;"></div>
                    </div>
                </div>

                <div class="lg:col-span-1">
                    <div class="bg-white rounded-2xl shadow-lg border border-slate-200/70 p-6">
                        <h3 class="text-xl font-bold mb-4">Acciones</h3>
                        <button id="updateStatusBtn" class="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md flex items-center justify-center gap-2">
                            <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                                Actualizar Estado
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function resolveIncidentCoordinates(incident) {
    if (incident && incident.geo) {
        const lat = Number(incident.geo.lat);
        const lng = Number(incident.geo.lng);
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
            return { lat, lng };
        }
    }

    if (!incident || !incident.location) return null;

    try {
        const query = encodeURIComponent(`${incident.location}, Espana`);
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${query}`);
        if (!response.ok) return null;

        const results = await response.json();
        if (!Array.isArray(results) || results.length === 0) return null;

        const lat = Number(results[0].lat);
        const lng = Number(results[0].lon);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

        return { lat, lng };
    } catch {
        return null;
    }
}

function getExternalMapUrl(incident) {
    if (window.getIncidentMapUrl) {
        return window.getIncidentMapUrl(incident);
    }

    const location = incident && incident.location ? incident.location : '';
    return `https://www.google.com/maps?q=${encodeURIComponent(location)}`;
}

function getStatusDisplayLabel(status) {
    const normalized = String(status || '').trim().toLowerCase();
    if (normalized === 'solucionada' || normalized === 'resuelta') return 'Resuelta';
    if (normalized === 'pendiente') return 'Pendiente';
    if (normalized === 'en proceso') return 'En proceso';
    if (!normalized) return 'Desconocido';
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

let detailStatusModalEl = null;
let detailStatusIncident = null;
let detailSelectedStatus = '';

function ensureDetailStatusModal() {
    if (detailStatusModalEl) return detailStatusModalEl;

    detailStatusModalEl = document.createElement('div');
    detailStatusModalEl.className = 'uh-modal-overlay';
    detailStatusModalEl.innerHTML = `
        <div class="uh-modal-card" role="dialog" aria-modal="true" aria-labelledby="detail-status-modal-title" style="width:min(100%,420px);">
            <div class="px-5 py-4 rounded-t-[16px] text-white" style="background:linear-gradient(120deg,#123a62 0%,#1d6fb8 55%,#0f8cb8 100%);">
                <div class="flex items-start justify-between gap-4">
                    <div>
                        <p class="text-[10px] uppercase tracking-[0.28em] text-white/70 font-extrabold">Actualizar incidencia</p>
                        <h3 id="detail-status-modal-title" class="mt-1 text-lg font-black">Cambiar estado</h3>
                        <p class="mt-1 text-sm text-white/85">Incidencia <span id="detailStatusIncidentId" class="font-mono font-bold">#</span></p>
                    </div>
                    <button type="button" class="w-9 h-9 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25 transition-colors" data-detail-status-close aria-label="Cerrar modal">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>

            <div class="p-5 space-y-4">
                <div class="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p class="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Estado actual</p>
                    <p id="detailCurrentStatus" class="mt-1 text-sm font-bold text-slate-900">Cargando...</p>
                </div>

                <div>
                    <p class="mb-2 text-sm font-black text-slate-800">Elige el nuevo estado</p>
                    <div class="space-y-2">
                        <button type="button" class="detail-status-option w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left flex items-start gap-3 hover:border-blue-500 hover:shadow-sm transition-all" data-status="en proceso">
                            <span class="detail-status-dot mt-1 w-4 h-4 rounded-full border-2 border-slate-300"></span>
                            <span>
                                <span class="block text-sm font-bold text-slate-900">En proceso</span>
                                <span class="block text-xs text-slate-500">La incidencia está siendo atendida.</span>
                            </span>
                        </button>
                        <button type="button" class="detail-status-option w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left flex items-start gap-3 hover:border-emerald-500 hover:shadow-sm transition-all" data-status="resuelta">
                            <span class="detail-status-dot mt-1 w-4 h-4 rounded-full border-2 border-slate-300"></span>
                            <span>
                                <span class="block text-sm font-bold text-slate-900">Resuelta</span>
                                <span class="block text-xs text-slate-500">La incidencia ya quedó resuelta.</span>
                            </span>
                        </button>
                        <button type="button" class="detail-status-option w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left flex items-start gap-3 hover:border-amber-500 hover:shadow-sm transition-all" data-status="pendiente">
                            <span class="detail-status-dot mt-1 w-4 h-4 rounded-full border-2 border-slate-300"></span>
                            <span>
                                <span class="block text-sm font-bold text-slate-900">Pendiente</span>
                                <span class="block text-xs text-slate-500">La incidencia queda a la espera de revisión.</span>
                            </span>
                        </button>
                    </div>
                </div>

                <div>
                    <label for="detailStatusComment" class="mb-2 block text-sm font-black text-slate-800">Comentario opcional</label>
                    <textarea id="detailStatusComment" placeholder="Agrega detalles sobre por qué cambias el estado..." class="w-full min-h-[90px] resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"></textarea>
                </div>

                <div class="flex items-center justify-end gap-2 pt-1">
                    <button type="button" class="uh-modal-btn uh-modal-btn-cancel" data-detail-status-cancel>Cancelar</button>
                    <button type="button" class="uh-modal-btn uh-modal-btn-confirm" data-detail-status-confirm>Guardar cambio</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(detailStatusModalEl);

    const closeModal = () => closeDetailStatusModal();
    detailStatusModalEl.addEventListener('click', (event) => {
        if (event.target === detailStatusModalEl) closeModal();
    });
    detailStatusModalEl.querySelector('[data-detail-status-close]').addEventListener('click', closeModal);
    detailStatusModalEl.querySelector('[data-detail-status-cancel]').addEventListener('click', closeModal);
    detailStatusModalEl.querySelector('[data-detail-status-confirm]').addEventListener('click', saveDetailStatusChange);

    detailStatusModalEl.querySelectorAll('.detail-status-option').forEach((button) => {
        button.addEventListener('click', () => {
            detailSelectedStatus = button.dataset.status || '';
            detailStatusModalEl.querySelectorAll('.detail-status-option').forEach(option => option.classList.remove('border-blue-500', 'border-emerald-500', 'border-rose-500', 'border-amber-500', 'bg-blue-50', 'bg-emerald-50', 'bg-rose-50', 'bg-amber-50'));
            detailStatusModalEl.querySelectorAll('.detail-status-dot').forEach(dot => dot.classList.remove('bg-blue-600', 'bg-emerald-600', 'bg-rose-600', 'bg-amber-600', 'border-blue-600', 'border-emerald-600', 'border-rose-600', 'border-amber-600'));
            button.classList.add('bg-blue-50');
            const dot = button.querySelector('.detail-status-dot');
            if (dot) {
                dot.classList.add('bg-blue-600');
                dot.classList.remove('border-slate-300');
                dot.classList.add('border-blue-600');
            }
            if (detailSelectedStatus === 'resuelta') {
                button.classList.remove('bg-blue-50');
                button.classList.add('bg-emerald-50', 'border-emerald-500');
                dot.classList.remove('bg-blue-600', 'border-blue-600');
                dot.classList.add('bg-emerald-600', 'border-emerald-600');
            } else if (detailSelectedStatus === 'pendiente') {
                button.classList.remove('bg-blue-50');
                button.classList.add('bg-amber-50', 'border-amber-500');
                dot.classList.remove('bg-blue-600', 'border-blue-600');
                dot.classList.add('bg-amber-600', 'border-amber-600');
            } else {
                button.classList.add('border-blue-500');
            }
        });
    });

    if (window.lucide) window.lucide.createIcons();
    return detailStatusModalEl;
}

function openDetailStatusModal(incident) {
    detailStatusIncident = incident;
    detailSelectedStatus = '';
    const modal = ensureDetailStatusModal();
    modal.querySelector('#detailStatusIncidentId').textContent = `#${incident.id}`;
    modal.querySelector('#detailCurrentStatus').textContent = getStatusDisplayLabel(incident.status);
    modal.querySelector('#detailStatusComment').value = '';
    modal.querySelectorAll('.detail-status-option').forEach(option => {
        option.classList.remove('bg-blue-50', 'bg-emerald-50', 'bg-rose-50', 'bg-amber-50', 'border-blue-500', 'border-emerald-500', 'border-rose-500', 'border-amber-500');
    });
    modal.classList.add('is-open');
    document.body.classList.add('overflow-hidden');
}

function closeDetailStatusModal() {
    if (!detailStatusModalEl) return;
    detailStatusModalEl.classList.remove('is-open');
    document.body.classList.remove('overflow-hidden');
    detailStatusIncident = null;
    detailSelectedStatus = '';
}

async function saveDetailStatusChange() {
    const modal = ensureDetailStatusModal();
    const newStatus = detailSelectedStatus;

    if (!detailStatusIncident) {
        alert('Incidencia no disponible.');
        return;
    }

    if (!newStatus) {
        alert('Selecciona un estado.');
        return;
    }

    detailStatusIncident.status = newStatus;

    if (window.incidentApi && typeof window.incidentApi.updateStatus === 'function') {
        const numericId = Number(String(detailStatusIncident.id).replace('INC', ''));
        if (Number.isFinite(numericId)) {
            try {
                const updated = await window.incidentApi.updateStatus(numericId, newStatus);

                const currentIncidents = Array.isArray(window.mockIncidents) ? window.mockIncidents : [];
                const normalizedId = String(detailStatusIncident.id);
                const updatedIncidents = currentIncidents.map((item) => {
                    if (String(item.id) !== normalizedId) return item;
                    return {
                        ...item,
                        status: newStatus,
                        ...(updated && typeof updated === 'object' ? updated : {})
                    };
                });

                if (window.saveIncidents) {
                    window.saveIncidents(updatedIncidents);
                } else {
                    window.mockIncidents = updatedIncidents;
                }

                if (window.loadIncidentsFromApi) {
                    await window.loadIncidentsFromApi();
                }
            } catch {
                // Keep local fallback if API fails.
            }
        }
    }

    alert('Estado actualizado correctamente');
    closeDetailStatusModal();
    render();
}

/**
 * INICIALIZACIÓN DEL MAPA
 */
async function initMapView(incident) {
    const mapContainer = document.getElementById('incidentMapDetail');

    // Verificaciones de seguridad
    if (!mapContainer || typeof L === 'undefined') {
        console.error("Error: No se pudo inicializar el mapa. Verifica Leaflet o las coordenadas.");
        return;
    }

    const coords = await resolveIncidentCoordinates(incident);
    if (!coords) {
        const mapUrl = getExternalMapUrl(incident);
        mapContainer.innerHTML = `
            <div class="p-4 text-sm text-slate-600 space-y-3">
                <p>No se pudo localizar esta direccion en el mapa.</p>
                <a href="${mapUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
                    Ver en Google Maps
                </a>
            </div>
        `;
        return;
    }

    // Si ya hay un mapa, lo eliminamos para evitar errores de re-inicialización
    if (mapContainer._leaflet_id) {
        mapContainer._leaflet_id = null;
        mapContainer.innerHTML = "";
    }

    // 1. Crear instancia del mapa usando las coordenadas del objeto incident
    const map = L.map('incidentMapDetail').setView([coords.lat, coords.lng], 16);

    // 2. Añadir capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // 3. Añadir el marcador
    L.marker([coords.lat, coords.lng])
        .addTo(map)
        .bindPopup(`<b>${incident.location}</b>`)
        .openPopup();

    // 4. TRUCO CRÍTICO: InvalidateSize para que cargue bien los tiles
    setTimeout(() => {
        map.invalidateSize();
    }, 200);
}

function setupStatusUpdate(incident) {
    const btn = document.getElementById('updateStatusBtn');
    if (!btn) return;

    btn.addEventListener('click', async () => {
        openDetailStatusModal(incident);
    });
}

/**
 * FUNCIÓN DE ARRANQUE
 */
async function render() {
    if (window.loadIncidentsFromApi) {
        await window.loadIncidentsFromApi();
    }

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!window.mockIncidents) {
        console.error("Los datos de incidencias no están cargados.");
        return;
    }

    const incident = (window.mockIncidents || []).find(i => i.id == id);

    if (!incident) {
        document.getElementById('app').innerHTML = `<div class="p-10 text-center">Incidencia no encontrada.</div>`;
        return;
    }

    // 1. Inyectar HTML
    document.getElementById('app').innerHTML = renderIncidentDetail(incident);

    // 2. Activar funcionalidades (Iconos y Botón)
    if (window.lucide) window.lucide.createIcons();
    setupStatusUpdate(incident); // <--- Lógica del botón

    // 3. Lanzar el mapa
    initMapView(incident);
    
    // Configurar cierre de sesión si tienes el botón en la navbar
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            const confirmed = window.confirmLogoutModal
                ? await window.confirmLogoutModal({
                    title: 'Cerrar sesion',
                    message: '¿Deseas cerrar sesion ahora?',
                    confirmText: 'Si, cerrar',
                    cancelText: 'Cancelar'
                })
                : confirm("¿Deseas cerrar sesión?");

            if (confirmed) window.location.href = 'login.html';
        });
    }
}

document.addEventListener('DOMContentLoaded', render);