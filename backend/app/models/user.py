from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.sql import func

from app.database import Base


class User(Base):
	__tablename__ = "Usuario"

	IdUsuario = Column(Integer, primary_key=True, index=True, autoincrement=True)
	Nombre = Column(String(100), nullable=False)
	Apellido1 = Column(String(100), nullable=False)
	Apellido2 = Column(String(100), nullable=False, default="")
	Email = Column(String(150), unique=True, nullable=False)
	Contrasena = Column(String(255), nullable=False)
	Telefono = Column(String(20), nullable=True)
	FechaRegistro = Column(DateTime, nullable=False, server_default=func.now())
	EstadoCuenta = Column(Boolean, nullable=False, default=True)
	IdRol = Column(Integer, nullable=False)
	IdServicio = Column(Integer, nullable=True)
