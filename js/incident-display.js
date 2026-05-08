(function () {
  function fallbackTitle() {
    return 'Incidencia sin título';
  }

  function normalizeText(value) {
    return String(value || '').trim();
  }

  function isGenericTitle(title) {
    return /^incidencia\s+de\s+/i.test(title);
  }

  function truncateText(value, maxLength) {
    if (!maxLength || value.length <= maxLength) {
      return value;
    }
    return value.slice(0, maxLength) + '...';
  }

  window.resolveIncidentDisplayTitle = function (incident, options) {
    var maxLength = options && Number.isFinite(options.maxLength) ? Number(options.maxLength) : 80;

    var rawTitle = normalizeText(incident && incident.title);
    var rawDescription = normalizeText(incident && incident.description);

    if (rawTitle && !isGenericTitle(rawTitle)) {
      return truncateText(rawTitle, maxLength);
    }

    if (rawDescription) {
      return truncateText(rawDescription, maxLength);
    }

    if (rawTitle) {
      return truncateText(rawTitle, maxLength);
    }

    return fallbackTitle();
  };
})();
