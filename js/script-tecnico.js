// Asegurar que Lucide no falle si no carga a tiempo
if (!window.lucide || typeof window.lucide.createIcons !== 'function') {
    window.lucide = { createIcons: function() {} };
}

// ============ DATA & STATE ============
const incidentsList = (window.mockIncidents || []).map(incident => ({
    ...incident,
    status: incident.status === 'en-proceso' ? 'en proceso' : incident.status
}));

let statusFilter = 'todos';
let categoryFilter = 'todos';
let chartInstance = null;

// ============ HELPERS ============
function getStatusColor(status) {
    if (status === 'resuelta') return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-400' };
    if (status === 'en proceso') return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-400' };
    return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-400' };
}

function getPriorityColor(priority) {
    if (priority === 'alta') return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-400' };
    if (priority === 'media') return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-400' };
    return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-400' };
}

function getFilteredIncidents() {
    return incidentsList.filter(inc => {
        const statusMatch = statusFilter === 'todos' || inc.status === statusFilter;
        const categoryMatch = categoryFilter === 'todos' || inc.category === categoryFilter;
        return statusMatch && categoryMatch;
    });
}

function getPriorityBadge(priority) {
    const colors = getPriorityColor(priority);
    return `<span class="inline-block px-3 py-1 rounded-lg text-xs font-semibold ${colors.bg} ${colors.text} border ${colors.border}">
        ${priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>`;
}

function getStatusBadge(status) {
    const colors = getStatusColor(status);
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    return `<span class="inline-block px-3 py-1 rounded-lg text-xs font-semibold ${colors.bg} ${colors.text} border ${colors.border}">
        ${label}
    </span>`;
}

function getMapUrl(incident) {
    if (window.getIncidentMapUrl) {
        return window.getIncidentMapUrl(incident);
    }
    return `https://www.google.com/maps?q=${encodeURIComponent(incident.location || '')}`;
}

function formatActionDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function nextActionId(actions) {
    return `A${(actions && actions.length ? actions.length : 0) + 1}`;
}

function nextHistoryId(statusHistory) {
    return `H${(statusHistory && statusHistory.length ? statusHistory.length : 0) + 1}`;
}

function getCurrentTechnicianName() {
    const stored = localStorage.getItem('currentTechnicianName');
    if (stored && stored.trim()) return stored.trim();

    const entered = prompt('Indica tu nombre de técnico para asignarte incidencias:', 'Carlos Rodríguez');
    if (entered && entered.trim()) {
        localStorage.setItem('currentTechnicianName', entered.trim());
        return entered.trim();
    }
    return null;
}

function persistIncidents() {
    if (window.saveIncidents) {
        window.saveIncidents(incidentsList);
    } else {
        window.mockIncidents = incidentsList;
    }
}

// ============ ACTIONS ============
function assignIncidentToCurrentTechnician(id, event) {
    if (event) event.stopPropagation();

    const technicianName = getCurrentTechnicianName();
    if (!technicianName) return;

    const incident = incidentsList.find(item => item.id === id);
    if (!incident) return;

    if (incident.assignedTechnician && incident.assignedTechnician !== technicianName) {
        const confirmReassign = confirm(`La incidencia ya está asignada a ${incident.assignedTechnician}. ¿Quieres reasignártela?`);
        if (!confirmReassign) return;
    }

    const now = new Date();
    incident.assignedTechnician = technicianName;
    incident.assignedDate = incident.assignedDate || now.toISOString().slice(0, 10);
    incident.actions = incident.actions || [];
    incident.statusHistory = incident.statusHistory || [];

    incident.actions.push({
        id: nextActionId(incident.actions),
        date: formatActionDate(now),
        technician: technicianName,
        action: 'Incidencia asignada al técnico',
        comment: 'Asignación realizada desde el panel de técnico.'
    });

    if (incident.status === 'pendiente') {
        incident.status = 'en proceso';
        incident.statusHistory.push({
            id: nextHistoryId(incident.statusHistory),
            status: 'en-proceso',
            date: now.toISOString(),
            comment: `Asignada a ${technicianName}.`
        });
    }

    persistIncidents();
    render();
}

function openIncident(id) {
    window.location.href = `incidencia-detalle.html?id=${encodeURIComponent(id)}`;
}

// ============ CHARTS & UI ============
function initChart() {
    const priorityData = {
        alta: incidentsList.filter(i => i.priority === 'alta').length,
        media: incidentsList.filter(i => i.priority === 'media').length,
        baja: incidentsList.filter(i => i.priority === 'baja').length
    };

    const canvas = document.getElementById('priorityChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Alta', 'Media', 'Baja'],
            datasets: [{
                data: [priorityData.alta, priorityData.media, priorityData.baja],
                backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { padding: 16, color: '#334155', font: { size: 13, weight: '600' } }
                }
            }
        }
    });
}

function renderDashboard() {
    const stats = {
        total: incidentsList.length,
        pending: incidentsList.filter(i => i.status === 'pendiente').length,
        inProgress: incidentsList.filter(i => i.status === 'en proceso').length,
        resolved: incidentsList.filter(i => i.status === 'resuelta').length
    };

    const filtered = getFilteredIncidents();

    return `
        <div class="max-w-7xl mx-auto space-y-8 pt-8 pb-20">
            <div class="bg-white rounded-2xl shadow-xl p-8 border border-slate-200/60 fade-in">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            Dashboard del Técnico
                        </h1>
                        <p class="text-slate-600 mt-2 flex items-center gap-2">
                            <i data-lucide="trending-up" class="h-4 w-4 text-indigo-500"></i>
                            Gestiona tus incidencias de manera eficiente
                        </p>
                    </div>
                    <div class="hidden md:flex items-center gap-3 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl shadow-lg">
                        <i data-lucide="clipboard-list" class="h-6 w-6"></i>
                        <div class="text-right">
                            <p class="text-xs opacity-90">Total activas</p>
                            <p class="text-2xl font-bold">${stats.total - stats.resolved}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Asignadas</p>
                        <p class="text-3xl font-bold mt-1">${stats.total}</p>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Pendientes</p>
                        <p class="text-3xl font-bold mt-1">${stats.pending}</p>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">En Proceso</p>
                        <p class="text-3xl font-bold mt-1">${stats.inProgress}</p>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Resueltas</p>
                        <p class="text-3xl font-bold mt-1">${stats.resolved}</p>
                    </div>
                </div>
            </div>

            <div class="grid gap-6 md:grid-cols-2">
                <div class="bg-white rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden slide-right">
                    <div class="bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 border-b border-indigo-100 p-6">
                        <h3 class="flex items-center gap-3 text-2xl font-bold text-slate-900">
                            <span class="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600">
                                <i data-lucide="trending-up" class="h-5 w-5"></i>
                            </span>
                            Incidencias por Prioridad
                        </h3>
                    </div>
                    <div class="p-6">
                        <div class="h-80 flex items-center justify-center">
                            <canvas id="priorityChart"></canvas>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden slide-right">
                    <div class="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-b border-emerald-100 p-6">
                        <h3 class="flex items-center gap-3 text-2xl font-bold text-slate-900">
                            <span class="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600">
                                <i data-lucide="check-circle-2" class="h-5 w-5"></i>
                            </span>
                            Estados de Incidencias
                        </h3>
                    </div>
                    <div class="p-6 space-y-7">
                        <div class="space-y-3">
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-semibold text-slate-700">Pendientes</span>
                                <span class="text-sm font-bold text-orange-600">${stats.pending}</span>
                            </div>
                            <div class="h-3 bg-slate-200 rounded-full overflow-hidden">
                                <div class="h-full bg-orange-500" style="width: ${(stats.pending / stats.total) * 100}%"></div>
                            </div>
                        </div>
                        <div class="space-y-3">
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-semibold text-slate-700">En Proceso</span>
                                <span class="text-sm font-bold text-violet-600">${stats.inProgress}</span>
                            </div>
                            <div class="h-3 bg-slate-200 rounded-full overflow-hidden">
                                <div class="h-full bg-violet-500" style="width: ${(stats.inProgress / stats.total) * 100}%"></div>
                            </div>
                        </div>
                        <div class="space-y-3">
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-semibold text-slate-700">Resueltas</span>
                                <span class="text-sm font-bold text-emerald-600">${stats.resolved}</span>
                            </div>
                            <div class="h-3 bg-slate-200 rounded-full overflow-hidden">
                                <div class="h-full bg-emerald-500" style="width: ${(stats.resolved / stats.total) * 100}%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-2xl shadow-lg border-0 slide-right">
                <div class="bg-gradient-to-r from-slate-50 via-indigo-50/50 to-blue-50 border-b border-slate-200 p-6">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h2 class="text-xl font-bold">Listado de Incidencias</h2>
                        <div class="flex gap-2">
                            <select onchange="statusFilter = this.value; render()" class="px-4 py-2 border-2 rounded-lg">
                                <option value="todos" ${statusFilter === 'todos' ? 'selected' : ''}>Todos los estados</option>
                                <option value="pendiente" ${statusFilter === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                                <option value="en proceso" ${statusFilter === 'en proceso' ? 'selected' : ''}>En proceso</option>
                                <option value="resuelta" ${statusFilter === 'resuelta' ? 'selected' : ''}>Resuelta</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="bg-slate-50 border-b">
                                <th class="px-6 py-4 text-sm">ID</th>
                                <th class="px-6 py-4 text-sm">Categoría</th>
                                <th class="px-6 py-4 text-sm">Ubicación</th>
                                <th class="px-6 py-4 text-sm">Prioridad</th>
                                <th class="px-6 py-4 text-sm">Estado</th>
                                <th class="px-6 py-4 text-sm">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filtered.map(inc => `
                                <tr onclick="openIncident('${inc.id}')" class="cursor-pointer hover:bg-indigo-50/50 border-b">
                                    <td class="px-6 py-4 font-bold text-indigo-600">${inc.id}</td>
                                    <td class="px-6 py-4 text-sm">${inc.category}</td>
                                    <td class="px-6 py-4 text-sm">${inc.location}</td>
                                    <td class="px-6 py-4">${getPriorityBadge(inc.priority)}</td>
                                    <td class="px-6 py-4">${getStatusBadge(inc.status)}</td>
                                    <td class="px-6 py-4">
                                        <button onclick="assignIncidentToCurrentTechnician('${inc.id}', event)" class="px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-700 text-xs font-semibold hover:bg-indigo-50">
                                            Asignarme
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function render() {
    const app = document.getElementById('app');
    try {
        app.innerHTML = renderDashboard();
        if (window.lucide) window.lucide.createIcons();
        setTimeout(initChart, 300);
    } catch (err) {
        console.error(err);
    }
}

// Inicialización
render();