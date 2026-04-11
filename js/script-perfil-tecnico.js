const defaultTechnicianProfile = {
  id: 'TEC001',
  fullName: 'Carlos Rodríguez',
  role: 'tecnico',
  email: 'carlos.rodriguez@urbanhelp.com',
  phone: '+34 611 223 344',
  employeeId: 'EMP-TEC-001',
  licenseNumber: 'LIC-45821',
  department: 'Mantenimiento urbano',
  specialty: 'Electricidad y alumbrado',
  assignedZone: 'Distrito Centro',
  shift: 'Mañana',
  availability: 'Disponible',
  address: 'Calle Técnica, 12',
  postalCode: '28001',
  city: 'Madrid',
  internalNotes: 'Técnico especializado en incidencias de alumbrado y mobiliario urbano.',
  notificationsEnabled: true
};

function getTechnicianProfile() {
  const stored = localStorage.getItem('technicianProfile');

  if (!stored) {
    return { ...defaultTechnicianProfile };
  }

  try {
    const parsed = JSON.parse(stored);

    return {
      ...defaultTechnicianProfile,
      ...parsed,
      fullName: defaultTechnicianProfile.fullName,
      role: defaultTechnicianProfile.role
    };
  } catch {
    return { ...defaultTechnicianProfile };
  }
}

function saveTechnicianProfile(profile) {
  const safeProfile = {
    ...defaultTechnicianProfile,
    ...profile,
    fullName: defaultTechnicianProfile.fullName,
    role: defaultTechnicianProfile.role
  };

  localStorage.setItem('technicianProfile', JSON.stringify(safeProfile));
}

window.defaultTechnicianProfile = defaultTechnicianProfile;
window.getTechnicianProfile = getTechnicianProfile;
window.saveTechnicianProfile = saveTechnicianProfile;