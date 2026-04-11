from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User

router = APIRouter(tags=["users"])


class UserRegisterPayload(BaseModel):
	nombre: str = Field(min_length=1, max_length=100)
	apellido_1: str = Field(min_length=1, max_length=100)
	apellido_2: str = Field(default="", max_length=100)
	email: str = Field(min_length=5, max_length=150)
	contrasena: str = Field(min_length=6, max_length=255)
	telefono: str | None = Field(default=None, max_length=20)
	rol: str = Field(pattern="^(ciudadano|tecnico)$")


class UserLoginPayload(BaseModel):
	email: str = Field(min_length=5, max_length=150)
	contrasena: str = Field(min_length=1, max_length=255)


class UserProfileUpdatePayload(BaseModel):
	email: str = Field(min_length=5, max_length=150)
	telefono: str | None = Field(default=None, max_length=20)


def role_to_frontend(id_rol: int) -> str:
	if id_rol == 2:
		return "tecnico"
	if id_rol == 3:
		return "gestor"
	if id_rol == 4:
		return "admin"
	return "user"


def user_to_payload(user: User) -> dict:
	return {
		"id": user.IdUsuario,
		"nombre": f"{user.Nombre} {user.Apellido1} {user.Apellido2}".strip(),
		"email": user.Email,
		"telefono": user.Telefono,
		"role": role_to_frontend(user.IdRol),
		"estadoCuenta": bool(user.EstadoCuenta),
	}


@router.post("/register", status_code=201)
def register_user(payload: UserRegisterPayload, db: Session = Depends(get_db)):
	normalized_email = payload.email.strip().lower()
	if "@" not in normalized_email or "." not in normalized_email.split("@")[-1]:
		raise HTTPException(status_code=422, detail="Email no valido")

	existing = db.query(User).filter(User.Email == normalized_email).first()
	if existing:
		raise HTTPException(status_code=409, detail="Ya existe un usuario con este email")

	is_technician = payload.rol == "tecnico"

	user = User(
		Nombre=payload.nombre.strip(),
		Apellido1=payload.apellido_1.strip(),
		Apellido2=(payload.apellido_2 or "").strip() or "-",
		Email=normalized_email,
		Contrasena=payload.contrasena,
		Telefono=(payload.telefono or "").strip() or None,
		EstadoCuenta=False if is_technician else True,
		IdRol=2 if is_technician else 1,
		IdServicio=None,
	)

	db.add(user)
	db.commit()
	db.refresh(user)

	return {
		"id": user.IdUsuario,
		"email": user.Email,
		"rol": payload.rol,
		"estadoCuenta": bool(user.EstadoCuenta),
		"message": "Usuario registrado correctamente",
	}


@router.post("/login")
def login_user(payload: UserLoginPayload, db: Session = Depends(get_db)):
	normalized_email = payload.email.strip().lower()
	user = db.query(User).filter(User.Email == normalized_email).first()

	if not user or user.Contrasena != payload.contrasena:
		raise HTTPException(status_code=401, detail="Credenciales invalidas")

	frontend_role = role_to_frontend(user.IdRol)

	if frontend_role == "tecnico" and not bool(user.EstadoCuenta):
		raise HTTPException(status_code=403, detail="Tu solicitud de tecnico esta pendiente de aprobacion")

	return {
		"id": user.IdUsuario,
		"email": user.Email,
		"role": frontend_role,
		"estadoCuenta": bool(user.EstadoCuenta),
	}


@router.get("/by-email/{email}")
def get_user_by_email(email: str, db: Session = Depends(get_db)):
	normalized_email = (email or "").strip().lower()
	user = db.query(User).filter(User.Email == normalized_email).first()
	if not user:
		raise HTTPException(status_code=404, detail="Usuario no encontrado")
	return user_to_payload(user)


@router.put("/{user_id}/profile")
def update_user_profile(user_id: int, payload: UserProfileUpdatePayload, db: Session = Depends(get_db)):
	user = db.query(User).filter(User.IdUsuario == user_id).first()
	if not user:
		raise HTTPException(status_code=404, detail="Usuario no encontrado")

	normalized_email = payload.email.strip().lower()
	if "@" not in normalized_email or "." not in normalized_email.split("@")[-1]:
		raise HTTPException(status_code=422, detail="Email no valido")

	existing = db.query(User).filter(User.Email == normalized_email, User.IdUsuario != user_id).first()
	if existing:
		raise HTTPException(status_code=409, detail="Ya existe un usuario con este email")

	user.Email = normalized_email
	user.Telefono = (payload.telefono or "").strip() or None
	db.commit()
	db.refresh(user)

	return user_to_payload(user)
