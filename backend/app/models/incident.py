from sqlalchemy import Column, DateTime, Enum, Integer, String, Text
from sqlalchemy.sql import func

from app.database import Base


class Incident(Base):
	__tablename__ = "Incidencia"

	IdIncidencia = Column(Integer, primary_key=True, index=True, autoincrement=True)
	Titulo = Column(String(150), nullable=False)
	Descripcion = Column(Text, nullable=False)
	FechaCreacion = Column(DateTime, nullable=False, server_default=func.now())
	FechaCierre = Column(DateTime, nullable=True)
	Prioridad = Column(Enum("Baja", "Media", "Urgente", name="prioridad_enum"), nullable=False)
	Direccion = Column(String(200), nullable=True)
	IdUsuarioCreador = Column(Integer, nullable=False)
	IdCategoria = Column(Integer, nullable=False)
	IdServicio = Column(Integer, nullable=True)
	IdTecnicoAsignado = Column(Integer, nullable=True)
	Estado = Column(
		Enum("Pendiente", "Asignada", "En proceso", "Solucionada", name="estado_enum"),
		nullable=False,
	)
