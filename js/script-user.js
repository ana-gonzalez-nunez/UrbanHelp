/**
 * Inicialización de seguridad para Lucide
 */
if (!window.lucide || typeof window.lucide.createIcons !== 'function') {
    window.lucide = { createIcons: function() {} };
}

/**
 * Genera el HTML de una tarjeta de estadística
 */
function statCard(title, value, valueColor, iconName, iconWrapClass, iconClass) {
    return `
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-slate-500 mb-1 uppercase tracking-wide">${title}</p>
                    <p class="text-3xl font-extrabold ${valueColor}">${value}</p>
                </div>
                <div class="${iconWrapClass} p-3 rounded-xl">
                    <i data-lucide="${iconName}" class="w-6 h-6 ${iconClass}"></i>
                </div>
            </div>
        </div>
    `;
}

let userDashboardRefreshTimer = null;

function scheduleUserDashboardRefresh() {
    if (userDashboardRefreshTimer) {
        clearTimeout(userDashboardRefreshTimer);
    }

    userDashboardRefreshTimer = setTimeout(() => {
        render();
    }, 120);
}

function startUserDashboardAutoRefresh() {
    window.setInterval(() => {
        if (document.hidden) return;
        scheduleUserDashboardRefresh();
    }, 10000);
}

function setupManualRefreshButton() {
    const refreshBtn = document.getElementById('refreshNowBtn');
    if (!refreshBtn || refreshBtn.dataset.bound === 'true') return;

    refreshBtn.dataset.bound = 'true';
    refreshBtn.addEventListener('click', () => {
        scheduleUserDashboardRefresh();
    });
}

/**
 * Función principal de renderizado
 */
async function render() {
    if (window.loadIncidentsFromApi) {
        await window.loadIncidentsFromApi();
    }

    // Verificamos que mockIncidents exista (viene de user-data.js)
    const incidents = window.mockIncidents || [];

    const pendingCount = incidents.filter(i => i.status === 'pendiente').length;
    const inProgressCount = incidents.filter(i => i.status === 'en-proceso').length;
    const resolvedCount = incidents.filter(i => i.status === 'resuelta').length;

    // Inyectar tarjetas de estadísticas
    const statsContainer = document.getElementById('statsCards');
    if (statsContainer) {
        statsContainer.innerHTML = [
            statCard('Pendientes', pendingCount, 'text-yellow-600', 'alert-circle', 'bg-yellow-100', 'text-yellow-600'),
            statCard('En Proceso', inProgressCount, 'text-blue-600', 'clock', 'bg-blue-100', 'text-blue-600'),
            statCard('Resueltas', resolvedCount, 'text-green-600', 'check-circle-2', 'bg-green-100', 'text-green-600')
        ].join('');
    }

    // Inyectar incidencias recientes (las 3 más nuevas)
    const recentContainer = document.getElementById('recentIncidents');
    if (recentContainer) {
        // Ordenamos por fecha de creación descendente
        const recentIncidents = [...incidents]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3);

        // Nota: Asegúrate de que la función renderIncidentCard esté definida en user-data.js 
        // o en algún script global, de lo contrario dará error.
        if (typeof renderIncidentCard === 'function') {
            recentContainer.innerHTML = recentIncidents.map(renderIncidentCard).join('');
        } else {
            console.warn("La función 'renderIncidentCard' no está definida.");
        }
    }

    // Refrescar iconos
    if (window.lucide) {
        window.lucide.createIcons();
    }

    setupManualRefreshButton();
}

// Ejecutar al cargar el script
document.addEventListener('DOMContentLoaded', render);

document.addEventListener('DOMContentLoaded', startUserDashboardAutoRefresh);

window.addEventListener('focus', () => {
    scheduleUserDashboardRefresh();
});

window.addEventListener('storage', (event) => {
    if (!event || event.key !== 'urbanIncidents') return;
    scheduleUserDashboardRefresh();
});