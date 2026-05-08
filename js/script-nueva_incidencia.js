/**
 * ESTADO Y VARIABLES GLOBALES
 */
let imageName = '';
let selectedCoords = null;
let mapInstance = null;
let marker = null;
let categoriesData = [];
let selectedCategoryId = null;
let locationSuggestions = [];
let locationSuggestionTimer = null;
let selectedAddressSuggestion = null;
let highlightedSuggestionIndex = -1;

const LOCATION_MIN_QUERY_LENGTH = 4;

function normalizeAddressText(value) {
  return String(value || '').trim().toLowerCase();
}

function clearLocationSuggestions() {
  const list = document.getElementById('locationSuggestions');
  if (!list) return;
  list.innerHTML = '';
  list.classList.add('hidden');
  highlightedSuggestionIndex = -1;
}

function renderLocationSuggestions(items) {
  const list = document.getElementById('locationSuggestions');
  if (!list) return;

  if (!Array.isArray(items) || items.length === 0) {
    clearLocationSuggestions();
    return;
  }

  list.innerHTML = items.map((item, index) => {
    const label = String(item.displayName || '').trim();
    return `<button type="button" data-index="${index}" class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 border-b border-slate-100 last:border-b-0">${label}</button>`;
  }).join('');

  highlightedSuggestionIndex = -1;
  list.classList.remove('hidden');
}

function updateHighlightedSuggestion(index) {
  const list = document.getElementById('locationSuggestions');
  if (!list) return;

  const buttons = Array.from(list.querySelectorAll('button[data-index]'));
  if (buttons.length === 0) {
    highlightedSuggestionIndex = -1;
    return;
  }

  const normalizedIndex = Math.max(0, Math.min(index, buttons.length - 1));
  highlightedSuggestionIndex = normalizedIndex;

  buttons.forEach((button, btnIndex) => {
    if (btnIndex === normalizedIndex) {
      button.classList.add('bg-blue-50', 'text-blue-700');
      button.classList.remove('text-slate-700');
      button.scrollIntoView({ block: 'nearest' });
    } else {
      button.classList.remove('bg-blue-50', 'text-blue-700');
      button.classList.add('text-slate-700');
    }
  });
}

function moveSuggestionSelection(direction) {
  if (!Array.isArray(locationSuggestions) || locationSuggestions.length === 0) return;

  if (highlightedSuggestionIndex < 0) {
    updateHighlightedSuggestion(direction > 0 ? 0 : locationSuggestions.length - 1);
    return;
  }

  const nextIndex = highlightedSuggestionIndex + direction;
  if (nextIndex < 0) {
    updateHighlightedSuggestion(locationSuggestions.length - 1);
    return;
  }

  if (nextIndex >= locationSuggestions.length) {
    updateHighlightedSuggestion(0);
    return;
  }

  updateHighlightedSuggestion(nextIndex);
}

function setLocationFromSuggestion(suggestion) {
  if (!suggestion) return;

  selectedAddressSuggestion = suggestion;
  selectedCoords = suggestion.coords || null;

  const locationInput = document.getElementById('location');
  if (locationInput) {
    locationInput.value = suggestion.displayName;
  }

  const selectedPoint = document.getElementById('selectedPoint');
  if (selectedPoint && suggestion.coords) {
    selectedPoint.textContent = 'Dirección validada automáticamente desde el buscador.';
  }

  if (mapInstance && suggestion.coords) {
    const latLng = [suggestion.coords.lat, suggestion.coords.lng];
    mapInstance.setView(latLng, 16);
    if (marker) marker.setLatLng(latLng);
    else marker = L.marker(latLng).addTo(mapInstance);
  }

  clearLocationSuggestions();
}

async function searchAddressSuggestions(query) {
  const normalizedQuery = String(query || '').trim();
  if (normalizedQuery.length < LOCATION_MIN_QUERY_LENGTH) {
    locationSuggestions = [];
    clearLocationSuggestions();
    return;
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&countrycodes=es&limit=5&q=${encodeURIComponent(normalizedQuery)}`;
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      locationSuggestions = [];
      clearLocationSuggestions();
      return;
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      locationSuggestions = [];
      clearLocationSuggestions();
      return;
    }

    locationSuggestions = data
      .map((item) => {
        const lat = Number(item.lat);
        const lon = Number(item.lon);
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
        const displayName = String(item.display_name || '').trim();
        if (!displayName) return null;

        return {
          displayName,
          coords: {
            lat: Number(lat.toFixed(6)),
            lng: Number(lon.toFixed(6))
          }
        };
      })
      .filter(Boolean);

    renderLocationSuggestions(locationSuggestions);
  } catch {
    locationSuggestions = [];
    clearLocationSuggestions();
  }
}

async function validateAndNormalizeAddress(addressText) {
  const candidate = String(addressText || '').trim();
  if (!candidate) return null;

  if (
    selectedAddressSuggestion &&
    normalizeAddressText(selectedAddressSuggestion.displayName) === normalizeAddressText(candidate)
  ) {
    return selectedAddressSuggestion;
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&countrycodes=es&limit=1&q=${encodeURIComponent(candidate)}`;
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const first = data[0];
    const lat = Number(first.lat);
    const lon = Number(first.lon);
    const displayName = String(first.display_name || '').trim();

    if (!displayName || !Number.isFinite(lat) || !Number.isFinite(lon)) {
      return null;
    }

    return {
      displayName,
      coords: {
        lat: Number(lat.toFixed(6)),
        lng: Number(lon.toFixed(6))
      }
    };
  } catch {
    return null;
  }
}

function buildApproxLocationText(coords) {
  if (!coords) return '';
  return `Zona aproximada (${coords.lat}, ${coords.lng})`;
}

async function reverseGeocode(coords) {
  if (!coords) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lng}&zoom=17&addressdetails=1`;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (!data) return null;

    return (data.display_name || '').trim() || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

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
            ${categoriesData.map(cat => `<option value="${cat.id}">${cat.nombre}</option>`).join('')}
          </select>
        </div>

        <div class="mb-6" id="subcategoryContainer" style="display: none;">
          <label class="block text-sm font-medium text-slate-900 mb-2">Tipo de problema (opcional)</label>
          <select id="subcategory" class="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500">
            <option value="">Selecciona un tipo específico</option>
          </select>
          <p class="text-xs text-slate-500 mt-1">Esto ayuda a asignar el problema al técnico correcto</p>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-slate-900 mb-2">Descripción del problema *</label>
          <textarea id="description" required rows="4" class="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-slate-900 mb-2">Dirección aproximada *</label>
          <div class="relative">
            <i data-lucide="map-pin" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"></i>
            <input id="location" type="text" class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
            <div id="locationSuggestions" class="hidden absolute z-20 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden"></div>
          </div>
          <p class="text-sm text-slate-500 mt-2">Escribe al menos 4 caracteres y selecciona una sugerencia validada; también puedes usar el mapa.</p>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-slate-900 mb-2">Ubicación en el mapa (opcional)</label>
          <div id="incidentMap" class="w-full min-h-[320px] rounded-xl border border-slate-300 overflow-hidden shadow-inner"></div>
          <p id="selectedPoint" class="text-sm text-slate-500 mt-2 italic">Si pinchas en el mapa, se usará una dirección aproximada editable.</p>
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

  window.setTimeout(() => {
    mapInstance.invalidateSize();
  }, 120);

  mapInstance.on('click', async (e) => {
    const { lat, lng } = e.latlng;
    selectedCoords = { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) };
    if (marker) marker.setLatLng(e.latlng);
    else marker = L.marker(e.latlng).addTo(mapInstance);

    const locationInput = document.getElementById('location');
    const selectedPoint = document.getElementById('selectedPoint');

    const fallbackLocation = buildApproxLocationText(selectedCoords);
    if (selectedPoint) {
      selectedPoint.textContent = `Coordenadas: ${selectedCoords.lat}, ${selectedCoords.lng}. Buscando dirección aproximada...`;
    }

    const approximatedAddress = await reverseGeocode(selectedCoords);
    const resolvedLocation = approximatedAddress || fallbackLocation;

    if (locationInput) {
      locationInput.value = resolvedLocation;
    }

    if (selectedPoint) {
      selectedPoint.textContent = approximatedAddress
        ? `Ubicación aproximada detectada y cargada en el campo de dirección.`
        : `Coordenadas: ${selectedCoords.lat}, ${selectedCoords.lng}. Se usará una zona aproximada.`;
    }
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(p => {
      mapInstance.setView([p.coords.latitude, p.coords.longitude], 15);
      window.setTimeout(() => mapInstance.invalidateSize(), 120);
    });
  }
}

/**
 * GESTIÓN DE EVENTOS
 */
async function loadCategoriesWithSubcategories() {
  try {
    if (!window.incidentApi) return false;
    categoriesData = await window.incidentApi.getCategoriesWithSubcategories();
    return Array.isArray(categoriesData) && categoriesData.length > 0;
  } catch {
    return false;
  }
}

function updateSubcategoriesDropdown(categoryId) {
  const subcategoryContainer = document.getElementById('subcategoryContainer');
  const subcategorySelect = document.getElementById('subcategory');
  
  const category = categoriesData.find(c => c.id === categoryId);
  
  if (!category || !category.subcategories || category.subcategories.length === 0) {
    subcategoryContainer.style.display = 'none';
    subcategorySelect.innerHTML = '<option value="">Selecciona un tipo específico</option>';
    selectedCategoryId = null;
    return;
  }
  
  subcategoryContainer.style.display = 'block';
  subcategorySelect.innerHTML = '<option value="">Selecciona un tipo específico</option>' +
    category.subcategories.map(sub => 
      `<option value="${sub.id}" data-nombre="${sub.nombre}">${sub.nombre}</option>`
    ).join('');
  
  selectedCategoryId = categoryId;
}

function bindEvents() {
  // Cambio de categoría
  document.getElementById('category').addEventListener('change', function(e) {
    const categoryId = parseInt(e.target.value);
    if (categoryId) {
      updateSubcategoriesDropdown(categoryId);
    } else {
      document.getElementById('subcategoryContainer').style.display = 'none';
      selectedCategoryId = null;
    }
  });

  const locationInput = document.getElementById('location');
  const locationSuggestionsList = document.getElementById('locationSuggestions');

  if (locationInput) {
    locationInput.addEventListener('input', function (e) {
      const currentValue = String(e.target.value || '').trim();

      if (
        selectedAddressSuggestion &&
        normalizeAddressText(selectedAddressSuggestion.displayName) !== normalizeAddressText(currentValue)
      ) {
        selectedAddressSuggestion = null;
      }

      if (locationSuggestionTimer) {
        clearTimeout(locationSuggestionTimer);
      }

      locationSuggestionTimer = setTimeout(() => {
        searchAddressSuggestions(currentValue);
      }, 300);
    });

    locationInput.addEventListener('focus', function () {
      if (locationSuggestions.length > 0) {
        renderLocationSuggestions(locationSuggestions);
      }
    });

    locationInput.addEventListener('keydown', function (event) {
      const list = document.getElementById('locationSuggestions');
      const isOpen = list && !list.classList.contains('hidden');

      if (event.key === 'ArrowDown') {
        if (!isOpen && locationSuggestions.length > 0) {
          renderLocationSuggestions(locationSuggestions);
        }
        event.preventDefault();
        moveSuggestionSelection(1);
        return;
      }

      if (event.key === 'ArrowUp') {
        if (!isOpen && locationSuggestions.length > 0) {
          renderLocationSuggestions(locationSuggestions);
        }
        event.preventDefault();
        moveSuggestionSelection(-1);
        return;
      }

      if (event.key === 'Enter' && isOpen && highlightedSuggestionIndex >= 0) {
        event.preventDefault();
        const selected = locationSuggestions[highlightedSuggestionIndex];
        if (selected) {
          setLocationFromSuggestion(selected);
        }
        return;
      }

      if (event.key === 'Escape' && isOpen) {
        event.preventDefault();
        clearLocationSuggestions();
      }
    });
  }

  if (locationSuggestionsList) {
    locationSuggestionsList.addEventListener('click', function (event) {
      const target = event.target.closest('button[data-index]');
      if (!target) return;

      const index = Number(target.dataset.index);
      if (!Number.isFinite(index) || !locationSuggestions[index]) return;
      setLocationFromSuggestion(locationSuggestions[index]);
    });
  }

  document.addEventListener('click', function (event) {
    const locationWrapper = document.getElementById('location')?.parentElement;
    if (!locationWrapper) return;
    if (!locationWrapper.contains(event.target)) {
      clearLocationSuggestions();
    }
  });

  // Envío de formulario
  document.getElementById('newIncidentForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const locationInput = document.getElementById('location');
    const manualLocation = locationInput.value.trim();
    const derivedLocation = !manualLocation && selectedCoords ? buildApproxLocationText(selectedCoords) : '';
    let finalLocation = manualLocation || derivedLocation;

    if (!manualLocation && !finalLocation) {
      return alert('Escribe una dirección aproximada o selecciona un punto en el mapa.');
    }

    if (manualLocation) {
      const normalizedAddress = await validateAndNormalizeAddress(manualLocation);
      if (!normalizedAddress) {
        return alert('No se pudo validar la dirección. Selecciona una sugerencia del buscador o marca un punto en el mapa.');
      }

      selectedAddressSuggestion = normalizedAddress;
      selectedCoords = normalizedAddress.coords || selectedCoords;
      finalLocation = normalizedAddress.displayName;
      locationInput.value = finalLocation;
    } else if (derivedLocation) {
      locationInput.value = derivedLocation;
    }

    const profile = window.getUserProfile ? getUserProfile() : {};
    const now = new Date().toISOString();
    const categoryId = parseInt(document.getElementById('category').value);
    const subcategoryId = document.getElementById('subcategory').value ? parseInt(document.getElementById('subcategory').value) : null;
    
    const category = categoriesData.find(c => c.id === categoryId);
    const subcategory = category && Array.isArray(category.subcategories)
      ? category.subcategories.find(sub => Number(sub.id) === Number(subcategoryId))
      : null;
    const categoryLabel = category ? category.nombre : 'General';
    const incidentTitle = (subcategory && subcategory.nombre)
      || document.getElementById('description').value.trim().slice(0, 150)
      || categoryLabel;
    
    const newIncident = {
      id: `INC${Date.now().toString().slice(-3)}`,
      title: incidentTitle,
      category: categoryLabel,
      description: document.getElementById('description').value.trim(),
      location: finalLocation,
      geo: selectedCoords,
      status: 'pendiente',
      createdAt: now,
      citizenName: profile.fullName || 'Ciudadano'
    };

    let createdIncident = null;

    if (window.createIncidentInApi) {
      createdIncident = await window.createIncidentInApi(newIncident, categoryLabel, subcategoryId);
    }

    if (createdIncident) {
      if (window.addIncident) window.addIncident(createdIncident);
    } else if (window.addIncident) {
      window.addIncident(newIncident);
    } else {
      window.mockIncidents = [newIncident, ...(window.mockIncidents || [])];
    }

    // Feedback de éxito y redirección
    document.getElementById('app').innerHTML = `<div class="p-20 text-center"><h2 class="text-2xl font-bold text-green-600">¡Incidencia registrada! Volviendo al panel...</h2></div>`;
    setTimeout(() => window.location.href = 'user.html', 1500);
  });
}

/**
 * INICIALIZACIÓN
 */
async function render() {
  // Cargar categorías con subcategorías
  const loaded = await loadCategoriesWithSubcategories();
  if (!loaded) {
    document.getElementById('app').innerHTML = '<div class="p-20 text-center text-red-600">Error al cargar categorías. Por favor, recarga la página.</div>';
    return;
  }
  
  document.getElementById('app').innerHTML = renderForm();
  if (window.lucide) window.lucide.createIcons();
  initMapPicker();
  bindEvents();
}

render();