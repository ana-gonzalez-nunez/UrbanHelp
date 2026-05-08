/**
 * Inicialización de Lucide
 */
if (!window.lucide || typeof window.lucide.createIcons !== 'function') {
  window.lucide = { createIcons: function() {} };
}

/**
 * Genera el HTML para las tarjetas de estadísticas del perfil
 */
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

/**
 * Carga los datos del perfil en los campos del formulario
 */
function fillForm(profile) {
  document.getElementById('fullName').value = profile.fullName || '';
  document.getElementById('email').value = profile.email || '';
  document.getElementById('phone').value = profile.phone || '';
  document.getElementById('address').value = profile.address || '';
  document.getElementById('postalCode').value = profile.postalCode || '';
  document.getElementById('city').value = profile.city || '';
  document.getElementById('notificationsEnabled').checked = !!profile.notificationsEnabled;
}

/**
 * Lee los datos actuales del formulario
 */
function readForm() {
  // Nota: getUserProfile() debe estar definido en user-data.js
  const currentProfile = typeof getUserProfile === 'function' ? getUserProfile() : {};
  
  return {
    ...currentProfile,
    fullName: document.getElementById('fullName').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    address: document.getElementById('address').value.trim(),
    postalCode: document.getElementById('postalCode').value.trim(),
    city: document.getElementById('city').value.trim(),
    notificationsEnabled: document.getElementById('notificationsEnabled').checked
  };
}

/**
 * Renderiza las estadísticas basándose en las incidencias del usuario
 */
function renderStats(profile) {
  const incidents = window.mockIncidents || [];
  const total = incidents.length;
  const resolved = incidents.filter(i => i.status === 'resuelta').length;
  const open = total - resolved;

  const statsContainer = document.getElementById('profileStats');
  if (statsContainer) {
    statsContainer.innerHTML = [
      statCard('Incidencias reportadas', total, 'text-slate-900', 'clipboard-list', 'bg-slate-100', 'text-slate-700'),
      statCard('Abiertas', open, 'text-blue-700', 'clock-3', 'bg-blue-100', 'text-blue-700'),
      statCard('Resueltas', resolved, 'text-emerald-700', 'check-circle-2', 'bg-emerald-100', 'text-emerald-700')
    ].join('');
  }

  if (profile.fullName) {
    document.title = `Perfil - ${profile.fullName}`;
  }
}

/**
 * Muestra el mensaje de confirmación temporal
 */
function showSavedMessage() {
  const message = document.getElementById('saveMessage');
  if (message) {
    message.classList.remove('hidden');
    setTimeout(() => message.classList.add('hidden'), 2500);
  }
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

function saveSessionInfo(email) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (!normalizedEmail) return;

  const currentSession = getSessionInfo();
  const updatedSession = {
    ...currentSession,
    email: normalizedEmail,
  };
  const serialized = JSON.stringify(updatedSession);

  try {
    localStorage.setItem('urbanHelpSession', serialized);
  } catch {
    // Ignore storage failures; sessionStorage still keeps the active tab in sync.
  }

  try {
    sessionStorage.setItem('urbanHelpSession', serialized);
  } catch {
    // Ignore storage failures in restricted browsing contexts.
  }
}

async function loadProfile() {
  const current = typeof getUserProfile === 'function' ? getUserProfile() : {};
  const sessionInfo = getSessionInfo();
  const sessionName = String(sessionInfo.nombre || sessionInfo.fullName || '').trim();
  const sessionEmail = String(sessionInfo.email || '').trim().toLowerCase();

  if (!sessionEmail || !window.userApi || typeof window.userApi.getByEmail !== 'function') {
    return {
      ...current,
      fullName: current.fullName || sessionName || '',
      email: current.email || sessionEmail || '',
    };
  }

  try {
    const user = await window.userApi.getByEmail(sessionEmail);
    return {
      ...current,
      id: String(user.id || current.id || ''),
      fullName: user.nombre || sessionName || current.fullName || '',
      email: user.email || sessionEmail,
      phone: user.telefono || current.phone || '',
      address: current.address || '',
      postalCode: current.postalCode || '',
      city: current.city || '',
      notificationsEnabled: typeof current.notificationsEnabled === 'boolean' ? current.notificationsEnabled : true,
    };
  } catch {
    return {
      ...current,
      fullName: current.fullName || sessionName || '',
      email: current.email || sessionEmail,
    };
  }
}

/**
 * Función de inicio
 */
async function init() {
  // Verificamos que las funciones de user-data.js existan
  if (typeof getUserProfile !== 'function') {
    console.error("La función 'getUserProfile' no está definida en user-data.js");
    return;
  }

  let profile = await loadProfile();
  if (typeof saveUserProfile === 'function') {
    saveUserProfile(profile);
  }
  fillForm(profile);
  renderStats(profile);

  // Manejo del guardado
  document.getElementById('profileForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const updatedProfile = readForm();
    const previousEmail = (profile && profile.email ? profile.email : '').trim().toLowerCase();
    const nextEmail = (updatedProfile.email || '').trim().toLowerCase();
    
    if (window.userApi && profile.id && typeof window.userApi.updateProfile === 'function') {
      try {
        const updated = await window.userApi.updateProfile(profile.id, {
          email: updatedProfile.email,
          telefono: updatedProfile.phone
        });
        profile = {
          ...updatedProfile,
          id: String(updated.id || profile.id || ''),
          fullName: updated.nombre || updatedProfile.fullName,
          email: updated.email || updatedProfile.email,
          phone: updated.telefono || updatedProfile.phone,
        };
      } catch (error) {
        const details = error && error.message ? error.message : 'No se pudo guardar en servidor';
        console.error(details);
        return;
      }
    } else {
      profile = { ...updatedProfile };
    }

    if (previousEmail && previousEmail !== nextEmail && window.getUserProfileStorageKey) {
      localStorage.removeItem(window.getUserProfileStorageKey(previousEmail));
    }

    if (nextEmail) {
      saveSessionInfo(nextEmail);
    }

    if (typeof saveUserProfile === 'function') {
      saveUserProfile(profile);
    }

    fillForm(profile);
    renderStats(profile);
    showSavedMessage();
  });

  // Manejo del reseteo
  document.getElementById('resetProfile').addEventListener('click', () => {
    const email = (profile && profile.email ? profile.email : '').trim().toLowerCase();
    if (window.getUserProfileStorageKey && email) {
      localStorage.removeItem(window.getUserProfileStorageKey(email));
    }

    loadProfile().then((reset) => {
      profile = reset;
      if (typeof saveUserProfile === 'function') {
        saveUserProfile(profile);
      }
      fillForm(profile);
      renderStats(profile);
    });
  });

  setupLogout();
  window.lucide.createIcons();
}

function setupLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (!logoutBtn) return;

  logoutBtn.addEventListener('click', async () => {
    const confirmed = window.confirmLogoutModal
      ? await window.confirmLogoutModal({
          title: 'Cerrar sesion',
          message: '¿Deseas cerrar sesion ahora?',
          confirmText: 'Si, cerrar',
          cancelText: 'Cancelar'
        })
      : window.confirm('¿Deseas cerrar sesion?');

    if (!confirmed) return;

    try {
      localStorage.removeItem('urbanHelpSession');
    } catch {
      // Ignore storage failures.
    }

    try {
      sessionStorage.removeItem('urbanHelpSession');
    } catch {
      // Ignore storage failures.
    }

    window.location.href = 'login.html';
  });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);