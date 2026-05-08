from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from app.database import Base


class Subcategory(Base):
	__tablename__ = "Subcategoria"

	IdSubcategoria = Column(Integer, primary_key=True, index=True, autoincrement=True)
	IdCategoria = Column(Integer, nullable=False, index=True)
	Nombre = Column(String(100), nullable=False)
	Descripcion = Column(String(200), nullable=True)
	Icono = Column(String(50), nullable=True)
	Prioridad = Column(String(20), nullable=True)
	created_at = Column(DateTime, nullable=False, server_default=func.now())
	updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())
