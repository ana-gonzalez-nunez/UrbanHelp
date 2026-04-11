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

    btn.addEventListener('click', () => {
        // 1. Aquí podrías abrir un modal o simplemente cambiar el estado para probar
        const nuevoEstado = prompt("Introduce el nuevo estado (pendiente, en proceso, resuelta):", incident.status);
        
        if (nuevoEstado && ['pendiente', 'en proceso', 'resuelta'].includes(nuevoEstado.toLowerCase())) {
            // 2. Actualizamos el objeto localmente
            incident.status = nuevoEstado.toLowerCase();
            
            // 3. Si tienes una función en user-data.js para guardar, úsala:
            if (window.saveIncidents) {
                // Buscamos la lista completa y actualizamos este
                const fullList = window.mockIncidents || [];
                const index = fullList.findIndex(i => i.id === incident.id);
                if (index !== -1) {
                    fullList[index] = incident;
                    window.saveIncidents(fullList);
                }
            }

            alert("Estado actualizado correctamente");
            
            // 4. Volvemos a renderizar para que se vea el cambio
            render(); 
        } else {
            alert("Estado no válido. Usa: pendiente, en proceso o resuelta.");
        }
    });
}

/**
 * FUNCIÓN DE ARRANQUE
 */
function render() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!window.mockIncidents) {
        console.error("Los datos de incidencias no están cargados.");
        return;
    }

    const incident = window.mockIncidents.find(i => i.id == id);

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