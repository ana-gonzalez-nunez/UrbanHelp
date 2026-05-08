(function () {
  let overlayEl = null;

  function ensureModal() {
    if (overlayEl) return overlayEl;

    overlayEl = document.createElement('div');
    overlayEl.className = 'uh-modal-overlay';
    overlayEl.innerHTML = `
      <div class="uh-modal-card" role="dialog" aria-modal="true" aria-labelledby="uh-modal-title">
        <div class="uh-modal-content">
          <h3 id="uh-modal-title" class="uh-modal-title"></h3>
          <p class="uh-modal-text"></p>
          <div class="uh-modal-actions">
            <button type="button" class="uh-modal-btn uh-modal-btn-cancel"></button>
            <button type="button" class="uh-modal-btn uh-modal-btn-confirm"></button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlayEl);
    return overlayEl;
  }

  window.confirmLogoutModal = function confirmLogoutModal(options) {
    const modal = ensureModal();
    const config = {
      title: 'Cerrar sesion',
      message: '¿Deseas cerrar sesion?',
      confirmText: 'Cerrar sesion',
      cancelText: 'Cancelar',
      ...(options || {})
    };

    const titleEl = modal.querySelector('.uh-modal-title');
    const textEl = modal.querySelector('.uh-modal-text');
    const cancelEl = modal.querySelector('.uh-modal-btn-cancel');
    const confirmEl = modal.querySelector('.uh-modal-btn-confirm');

    titleEl.textContent = config.title;
    textEl.textContent = config.message;
    cancelEl.textContent = config.cancelText;
    confirmEl.textContent = config.confirmText;

    return new Promise((resolve) => {
      const cleanup = (result) => {
        modal.classList.remove('is-open');
        confirmEl.removeEventListener('click', onConfirm);
        cancelEl.removeEventListener('click', onCancel);
        modal.removeEventListener('click', onBackdrop);
        document.removeEventListener('keydown', onEscape);
        resolve(result);
      };

      const onConfirm = () => cleanup(true);
      const onCancel = () => cleanup(false);
      const onBackdrop = (event) => {
        if (event.target === modal) cleanup(false);
      };
      const onEscape = (event) => {
        if (event.key === 'Escape') cleanup(false);
      };

      confirmEl.addEventListener('click', onConfirm);
      cancelEl.addEventListener('click', onCancel);
      modal.addEventListener('click', onBackdrop);
      document.addEventListener('keydown', onEscape);

      modal.classList.add('is-open');
      confirmEl.focus();
    });
  };
})();
