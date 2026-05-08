if (!window.lucide || typeof window.lucide.createIcons !== 'function') {
  window.lucide = { createIcons: function () {} };
}

const TECH_PROFILE_KEY = 'technicianProfile';

function statCard(title, value, valueClass, iconName, iconBgClass, iconClass) {
  return `
    <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs text-slate-500 uppercase tracking-wide">${title}</p>
          <p class="text-2xl font-extrabold ${valueClass}">${value}</p>
        </div>
        <div class="${iconBgClass} p-2.5 rounded-xl">
          <i data-lucide="${iconName}" class="w-5 h-5 ${iconClass}"></i>
        </div>
      </div>
    </div>
  `;
}

function getSessionInfo() {
  const local = localStorage.getItem('urbanHelpSession');
  const session = sessionStorage.getItem('urbanHelpSession');
  const raw = local || session;
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function getProfileStorageKey(email) {
  return `${TECH_PROFILE_KEY}:${(email || 'default').toLowerCase()}`;
}

function getStoredProfile(email) {
  const key = getProfileStorageKey(email);
  const raw = localStorage.getItem(key);
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveStoredProfile(email, profile) {
  const key = getProfileStorageKey(email);
  localStorage.setItem(key, JSON.stringify(profile));
}

function getDefaultProfile(email) {
  return {
    id: '',
    fullName: 'Técnico',
    role: 'tecnico',
    email: email || '',
    phone: '',
    licenseNumber: '',
    department: '',
    specialty: '',
    assignedZone: '',
    shift: 'Manana',
    availability: 'Disponible',
    address: '',
    postalCode: '',
    city: '',
    internalNotes: '',
    notificationsEnabled: true
  };
}

async function loadProfile() {
  const session = getSessionInfo();
  const sessionName = String(session.nombre || session.fullName || '').trim();
  const currentEmail = (session.email || '').toLowerCase();
  const stored = getStoredProfile(currentEmail);
  const base = getDefaultProfile(currentEmail);

  if (window.userApi && currentEmail) {
    try {
      const user = await window.userApi.getByEmail(currentEmail);
      return {
        ...base,
        ...stored,
        id: String(user.id || ''),
        fullName: user.nombre || sessionName || base.fullName,
        role: user.role || 'tecnico',
        email: user.email || currentEmail,
        phone: user.telefono || stored.phone || ''
      };
    } catch {
      return {
        ...base,
        ...stored,
        fullName: stored.fullName || sessionName || base.fullName,
        email: currentEmail || stored.email || ''
      };
    }
  }

  return {
    ...base,
    ...stored,
    fullName: stored.fullName || sessionName || base.fullName
  };
}

function fillForm(profile) {
  document.getElementById('fullName').value = profile.fullName || '';
  document.getElementById('role').value = profile.role || 'tecnico';
  document.getElementById('email').value = profile.email || '';
  document.getElementById('phone').value = profile.phone || '';
  document.getElementById('licenseNumber').value = profile.licenseNumber || '';
  document.getElementById('department').value = profile.department || '';
  document.getElementById('specialty').value = profile.specialty || '';
  document.getElementById('assignedZone').value = profile.assignedZone || '';
  document.getElementById('shift').value = profile.shift || 'Manana';
  document.getElementById('availability').value = profile.availability || 'Disponible';
  document.getElementById('address').value = profile.address || '';
  document.getElementById('postalCode').value = profile.postalCode || '';
  document.getElementById('city').value = profile.city || '';
  document.getElementById('internalNotes').value = profile.internalNotes || '';
  document.getElementById('notificationsEnabled').checked = !!profile.notificationsEnabled;
}

function readForm(profile) {
  return {
    ...profile,
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    licenseNumber: document.getElementById('licenseNumber').value.trim(),
    department: document.getElementById('department').value.trim(),
    specialty: document.getElementById('specialty').value.trim(),
    assignedZone: document.getElementById('assignedZone').value.trim(),
    shift: document.getElementById('shift').value,
    availability: document.getElementById('availability').value,
    address: document.getElementById('address').value.trim(),
    postalCode: document.getElementById('postalCode').value.trim(),
    city: document.getElementById('city').value.trim(),
    internalNotes: document.getElementById('internalNotes').value.trim(),
    notificationsEnabled: document.getElementById('notificationsEnabled').checked
  };
}

async function resolveIncidents() {
  if (window.loadIncidentsFromApi) {
    await window.loadIncidentsFromApi();
  }
  return window.mockIncidents || [];
}

async function renderStats(profile) {
  const incidents = await resolveIncidents();
  const byTechnician = incidents.filter((item) => (item.assignedTechnician || '').trim() === (profile.fullName || '').trim());

  const assigned = byTechnician.length;
  const inProgress = byTechnician.filter((i) => i.status === 'en-proceso' || i.status === 'en proceso').length;
  const resolved = byTechnician.filter((i) => i.status === 'resuelta').length;
  const highPriority = byTechnician.filter((i) => i.priority === 'alta').length;

  const container = document.getElementById('profileStats');
  container.innerHTML = [
    statCard('Asignadas', assigned, 'text-slate-900', 'clipboard-list', 'bg-slate-100', 'text-slate-700'),
    statCard('En proceso', inProgress, 'text-blue-700', 'clock-3', 'bg-blue-100', 'text-blue-700'),
    statCard('Resueltas', resolved, 'text-emerald-700', 'check-circle-2', 'bg-emerald-100', 'text-emerald-700'),
    statCard('Prioridad alta', highPriority, 'text-red-700', 'alert-triangle', 'bg-red-100', 'text-red-700')
  ].join('');

  if (profile.fullName) {
    document.title = `Perfil técnico - ${profile.fullName}`;
  }
}

function showSavedMessage(text, isError) {
  const message = document.getElementById('saveMessage');
  message.textContent = text;
  message.classList.remove('hidden', 'text-emerald-700', 'text-red-700');
  message.classList.add(isError ? 'text-red-700' : 'text-emerald-700');
  setTimeout(() => message.classList.add('hidden'), 2500);
}

async function saveProfile(profile) {
  if (window.userApi && profile.id) {
    try {
      const updated = await window.userApi.updateProfile(profile.id, {
        email: profile.email,
        telefono: profile.phone
      });
      profile.email = updated.email || profile.email;
      profile.phone = updated.telefono || profile.phone;
    } catch (error) {
      const details = error && error.message ? error.message : 'No se pudo guardar en servidor';
      showSavedMessage(details, true);
      return false;
    }
  }

  saveStoredProfile(profile.email, profile);
  return true;
}

function setupLogout() {
  const btn = document.getElementById('logoutBtn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const confirmed = window.confirmLogoutModal
      ? await window.confirmLogoutModal({
          title: 'Cerrar sesion',
          message: '¿Deseas cerrar sesion ahora?',
          confirmText: 'Si, cerrar',
          cancelText: 'Cancelar'
        })
      : window.confirm('¿Deseas cerrar sesion?');

    if (!confirmed) return;

    window.location.href = 'login.html';
  });
}

async function init() {
  let profile = await loadProfile();
  fillForm(profile);
  await renderStats(profile);
  setupLogout();

  document.getElementById('techProfileForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    profile = readForm(profile);

    const ok = await saveProfile(profile);
    if (!ok) return;

    fillForm(profile);
    await renderStats(profile);
    showSavedMessage('Perfil técnico guardado correctamente.', false);
  });

  document.getElementById('resetTechProfile').addEventListener('click', async () => {
    localStorage.removeItem(getProfileStorageKey(profile.email));
    profile = await loadProfile();
    fillForm(profile);
    await renderStats(profile);
  });

  window.lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', init);
