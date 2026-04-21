from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User

router = APIRouter(tags=["admin"])


def map_role_name(role_id: int) -> str:
	if role_id == 2:
		return "tecnico"
	if role_id == 3:
		return "gestor"
	if role_id == 4:
		return "admin"
	return "ciudadano"


def map_role_id(role_name: str) -> int:
	role = (role_name or "").strip().lower()
	if role == "tecnico":
		return 2
	if role == "gestor":
		return 3
	if role == "admin":
		return 4
	return 1


class UserRoleUpdate(BaseModel):
	rol: str = Field(pattern="^(ciudadano|tecnico|gestor|admin)$")


@router.get("/users")
def list_users(db: Session = Depends(get_db)):
	users = db.query(User).order_by(User.IdUsuario.desc()).all()

	return [
		{
			"id": str(user.IdUsuario),
			"nombre": f"{user.Nombre} {user.Apellido1} {user.Apellido2}".strip(),
			"email": user.Email,
			"rol": map_role_name(user.IdRol),
			"estadoCuenta": bool(user.EstadoCuenta),
		}
		for user in users
	]


@router.get("/technician-requests")
def list_technician_requests(db: Session = Depends(get_db)):
	pending = (
		db.query(User)
		.filter(User.IdRol == 2)
		.filter(User.EstadoCuenta == False)  # noqa: E712
		.order_by(User.IdUsuario.desc())
		.all()
	)

	return [
		{
			"id": str(user.IdUsuario),
			"nombre": f"{user.Nombre} {user.Apellido1} {user.Apellido2}".strip(),
			"email": user.Email,
			"especialidad": "General",
			"fecha": user.FechaRegistro.date().isoformat() if user.FechaRegistro else None,
			"status": "pendiente",
		}
		for user in pending
	]


@router.put("/technician-requests/{user_id}/approve")
def approve_technician_request(user_id: int, db: Session = Depends(get_db)):
	user = db.query(User).filter(User.IdUsuario == user_id).first()
	if not user or user.IdRol != 2:
		raise HTTPException(status_code=404, detail="Solicitud no encontrada")

	user.EstadoCuenta = True
	db.commit()
	db.refresh(user)

	return {"id": user.IdUsuario, "status": "aceptada"}


@router.put("/technician-requests/{user_id}/reject")
def reject_technician_request(user_id: int, db: Session = Depends(get_db)):
	user = db.query(User).filter(User.IdUsuario == user_id).first()
	if not user or user.IdRol != 2:
		raise HTTPException(status_code=404, detail="Solicitud no encontrada")

	# Rechazo: el usuario pasa a ciudadano activo.
	user.IdRol = 1
	user.EstadoCuenta = True
	db.commit()
	db.refresh(user)

	return {"id": user.IdUsuario, "status": "rechazada"}


@router.put("/users/{user_id}/role")
def update_user_role(user_id: int, payload: UserRoleUpdate, db: Session = Depends(get_db)):
	user = db.query(User).filter(User.IdUsuario == user_id).first()
	if not user:
		raise HTTPException(status_code=404, detail="Usuario no encontrado")

	user.IdRol = map_role_id(payload.rol)
	# Cambio de rol por admin: cuenta activa de inmediato.
	user.EstadoCuenta = True

	db.commit()
	db.refresh(user)

	return {
		"id": str(user.IdUsuario),
		"rol": map_role_name(user.IdRol),
		"estadoCuenta": bool(user.EstadoCuenta),
	}
