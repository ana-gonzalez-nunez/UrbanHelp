(function () {
  let overlayEl = null;

  function ensureModal() {
    if (overlayEl) return overlayEl;

    overlayEl = document.createElement('div');
    overlayEl.className = 'uh-modal-overlay';
    overlayEl.innerHTML = `
      <div class="uh-modal-card status-modal-card" role="dialog" aria-modal="true" aria-labelledby="status-modal-title">
        <div class="status-modal-header">
          <div class="status-modal-header-top">
            <div>
              <p class="status-modal-eyebrow">Actualizar incidencia</p>
              <h3 id="status-modal-title" class="status-modal-title">Cambiar estado</h3>
              <p class="status-modal-subtitle">Incidencia <span id="modalIncidentId" class="status-modal-id">#</span></p>
            </div>
            <button type="button" class="status-modal-close" aria-label="Cerrar modal" data-status-close>
              <i data-lucide="x" class="h-4 w-4"></i>
            </button>
          </div>
        </div>

        <div class="uh-modal-content status-modal-content">
          <div class="status-modal-chip">
            <span class="status-modal-chip-label">Estado actual</span>
            <span id="currentStatus" class="status-modal-chip-value">Cargando...</span>
          </div>

          <div class="status-modal-section">
            <p class="status-modal-section-title">Elige el nuevo estado</p>
            <div class="status-modal-options">
              <button type="button" class="status-option" data-status="en proceso">
                <span class="status-dot"></span>
                <span class="status-option-copy">
                  <span class="status-option-title">En proceso</span>
                  <span class="status-option-text">La incidencia está siendo atendida.</span>
                </span>
              </button>

              <button type="button" class="status-option" data-status="resuelta">
                <span class="status-dot"></span>
                <span class="status-option-copy">
                  <span class="status-option-title">Resuelta</span>
                  <span class="status-option-text">La incidencia ya quedó resuelta.</span>
                </span>
              </button>

              <button type="button" class="status-option" data-status="pendiente">
                <span class="status-dot"></span>
                <span class="status-option-copy">
                  <span class="status-option-title">Pendiente</span>
                  <span class="status-option-text">La incidencia queda a la espera de revisión.</span>
                </span>
              </button>
            </div>
            <input type="hidden" id="statusSelect">
          </div>

          <div class="status-modal-section">
            <label for="statusComment" class="status-modal-section-title">Comentario opcional</label>
            <textarea id="statusComment" placeholder="Agrega detalles sobre por qué cambias el estado..." class="status-modal-textarea"></textarea>
          </div>

          <div class="uh-modal-actions status-modal-actions">
            <button type="button" class="uh-modal-btn uh-modal-btn-cancel" data-status-cancel>
              Cancelar
            </button>
            <button type="button" class="uh-modal-btn uh-modal-btn-confirm" data-status-confirm>
              Guardar cambio
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlayEl);
    return overlayEl;
  }

  function wireSharedHandlers() {
    const modal = ensureModal();
    const cancelEl = modal.querySelector('[data-status-cancel]');
    const confirmEl = modal.querySelector('[data-status-confirm]');
    const closeEl = modal.querySelector('[data-status-close]');
    const optionButtons = modal.querySelectorAll('[data-status]');

    if (!modal.dataset.wired) {
      modal.dataset.wired = 'true';
      const close = () => {
        if (window.closeStatusModal) {
          window.closeStatusModal();
        }
      };

      const confirm = () => {
        if (window.updateIncidentStatus) {
          window.updateIncidentStatus();
        }
      };

      cancelEl.addEventListener('click', close);
      closeEl.addEventListener('click', close);
      confirmEl.addEventListener('click', confirm);

      optionButtons.forEach((button) => {
        button.addEventListener('click', () => {
          if (window.selectStatus) {
            window.selectStatus(button.dataset.status, button);
          }
        });
      });

      modal.addEventListener('click', (event) => {
        if (event.target === modal) close();
      });
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) {
          close();
        }
      });
    }

    return { modal, confirmEl };
  }

  window.ensureIncidentStatusModal = ensureModal;
  window.wireIncidentStatusModalHandlers = wireSharedHandlers;
  ensureModal();
})();
