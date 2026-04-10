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

/**
 * Función de inicio
 */
function init() {
  // Verificamos que las funciones de user-data.js existan
  if (typeof getUserProfile !== 'function') {
    console.error("La función 'getUserProfile' no está definida en user-data.js");
    return;
  }

  const profile = getUserProfile();
  fillForm(profile);
  renderStats(profile);

  // Manejo del guardado
  document.getElementById('profileForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const updatedProfile = readForm();
    
    if (typeof saveUserProfile === 'function') {
      saveUserProfile(updatedProfile);
      renderStats(updatedProfile);
      showSavedMessage();
    }
  });

  // Manejo del reseteo
  document.getElementById('resetProfile').addEventListener('click', () => {
    localStorage.removeItem('userProfile');
    const reset = getUserProfile();
    fillForm(reset);
    renderStats(reset);
  });

  window.lucide.createIcons();
}

// Dentro de tu función init o al final del script
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        // Borramos los datos de sesión si fuera necesario
        // localStorage.removeItem('userProfile'); 
        
        // Efecto de salida simple
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s';
        
        setTimeout(() => {
            window.location.href = 'login.html'; 
        }, 500);
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);