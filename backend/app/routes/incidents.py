from datetime import datetime
from typing import Optional
import asyncio
from contextlib import suppress

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session
from fastapi.responses import StreamingResponse

from app.database import get_db
from app.models.incident import Incident
from app.models.subcategory import Subcategory

router = APIRouter(tags=["incidents"])


class IncidentCreate(BaseModel):
	title: Optional[str] = None
	description: str
	location: str
	category: str
	subcategory: Optional[str] = None
	subcategoryId: Optional[int] = None
	priority: Optional[str] = "media"
	userId: Optional[int] = 1


class IncidentStatusUpdate(BaseModel):
	status: str


class IncidentAssignTechnicianPayload(BaseModel):
	technicianId: int


def normalize_priority(priority: str) -> str:
	mapping = {
		"baja": "Baja",
		"media": "Media",
		"alta": "Urgente",
		"urgente": "Urgente",
	}
	return mapping.get((priority or "media").strip().lower(), "Media")


def normalize_status(status: str) -> str:
	mapping = {
		"Pendiente": "pendiente",
		"Asignada": "en-proceso",
		"En proceso": "en-proceso",
		"Solucionada": "resuelta",
	}
	return mapping.get(status, "pendiente")


def normalize_status_to_db(status: str) -> str:
	mapping = {
		"pendiente": "Pendiente",
		"en-proceso": "En proceso",
		"en proceso": "En proceso",
		"resuelta": "Solucionada",
		"solucionada": "Solucionada",
		"asignada": "Asignada",
	}
	return mapping.get((status or "pendiente").strip().lower(), "Pendiente")


def map_category_to_id(category: str) -> int:
	normalized = (category or "").strip().lower()
	category_map = {
		"alumbrado": 1,
		"alumbrado publico": 1,
		"alumbrado público": 1,
		"limpieza": 2,
		"via publica": 3,
		"vía pública": 3,
		"vias-publicas": 3,
		"vias publicas": 3,
		"vía publica": 3,
		"parques": 4,
		"parques y jardines": 4,
		"transporte": 5,
		"senalizacion": 5,
		"señalizacion": 5,
		"señalización": 5,
		"infraestructura": 6,
		"servicios e infraestructura": 6,
		"agua y saneamiento": 6,
		"agua": 6,
		"mobiliario": 7,
		"mobiliario urbano": 7,
		"mobiliario-urbano": 7,
	}
	return category_map.get(normalized, 2)


def get_subcategories_by_category(category_id: int, db: Session) -> list:
	"""Obtiene todas las subcategorías de una categoría"""
	subcategories = db.query(Subcategory).filter(
		Subcategory.IdCategoria == category_id
	).all()
	return [{
		"id": s.IdSubcategoria,
		"nombre": s.Nombre,
		"descripcion": s.Descripcion,
		"icono": s.Icono,
		"prioridad": s.Prioridad,
	} for s in subcategories]


def build_incident_title(payload: IncidentCreate, subcategory_name: Optional[str]) -> str:
	explicit_title = (payload.title or "").strip()
	if explicit_title:
		return explicit_title

	description = (payload.description or "").strip()
	if description:
		return description[:150]

	if subcategory_name:
		return subcategory_name

	return f"Incidencia de {payload.category}".strip()


def map_row_to_frontend(item: Incident, db: Session) -> dict:
	category_name = None
	user_name = None
	assigned_technician_name = None

	category_row = db.execute(
		text("SELECT Nombre FROM Categoria WHERE IdCategoria = :id"),
		{"id": item.IdCategoria},
	).mappings().first()
	if category_row:
		category_name = category_row.get("Nombre")

	user_row = db.execute(
		text("SELECT Nombre, Apellido1, Apellido2 FROM Usuario WHERE IdUsuario = :id"),
		{"id": item.IdUsuarioCreador},
	).mappings().first()
	if user_row:
		name_parts = [
			(user_row.get('Nombre') or '').strip(),
			(user_row.get('Apellido1') or '').strip(),
			(user_row.get('Apellido2') or '').strip(),
		]
		user_name = " ".join([part for part in name_parts if part and part != "-"]).strip()

	if item.IdTecnicoAsignado:
		technician_row = db.execute(
			text("SELECT Nombre, Apellido1, Apellido2 FROM Usuario WHERE IdUsuario = :id"),
			{"id": item.IdTecnicoAsignado},
		).mappings().first()
		if technician_row:
			tech_parts = [
				(technician_row.get('Nombre') or '').strip(),
				(technician_row.get('Apellido1') or '').strip(),
				(technician_row.get('Apellido2') or '').strip(),
			]
			assigned_technician_name = " ".join([part for part in tech_parts if part and part != "-"]).strip()

	return {
		"id": str(item.IdIncidencia),
		"title": item.Titulo,
		"category": category_name or "General",
		"description": item.Descripcion,
		"location": item.Direccion or "",
		"status": normalize_status(item.Estado),
		"priority": (item.Prioridad or "Media").lower().replace("urgente", "alta"),
		"createdAt": item.FechaCreacion.isoformat() if isinstance(item.FechaCreacion, datetime) else None,
		"citizenName": user_name or "Ciudadano",
		"assignedTechnician": assigned_technician_name,
		"assignedTechnicianId": item.IdTecnicoAsignado,
		"statusHistory": [],
		"actions": [],
	}


@router.get("")
def list_incidents(db: Session = Depends(get_db)):
	items = db.query(Incident).order_by(Incident.IdIncidencia.desc()).all()
	return [map_row_to_frontend(item, db) for item in items]


def get_incidents_signature(db: Session) -> str:
	rows = db.execute(
		text(
			"""
			SELECT
				COUNT(*) AS total,
				COALESCE(MAX(IdIncidencia), 0) AS max_id,
				SUM(CASE WHEN Estado = 'Pendiente' THEN 1 ELSE 0 END) AS pending_count,
				SUM(CASE WHEN Estado IN ('En proceso', 'Asignada') THEN 1 ELSE 0 END) AS in_progress_count,
				SUM(CASE WHEN Estado = 'Solucionada' THEN 1 ELSE 0 END) AS solved_count,
				SUM(CASE WHEN IdTecnicoAsignado IS NOT NULL THEN 1 ELSE 0 END) AS assigned_count
			FROM Incidencia
			"""
		)
	).mappings().first()

	if not rows:
		return "0|0|0|0|0|0"

	return "|".join([
		str(rows.get("total") or 0),
		str(rows.get("max_id") or 0),
		str(rows.get("pending_count") or 0),
		str(rows.get("in_progress_count") or 0),
		str(rows.get("solved_count") or 0),
		str(rows.get("assigned_count") or 0),
	])


@router.get("/stream")
async def stream_incidents():
	db_gen = get_db()
	db_session = next(db_gen)

	async def event_generator():
		previous_signature = None

		try:
			# Initial event to confirm subscription is alive.
			yield "event: connected\ndata: ready\n\n"

			while True:
				try:
					current_signature = get_incidents_signature(db_session)
					if current_signature != previous_signature:
						previous_signature = current_signature
						yield f"event: incidents-updated\ndata: {current_signature}\n\n"

					# Keep-alive heartbeat for proxies/timeouts.
					yield "event: heartbeat\ndata: ok\n\n"
					await asyncio.sleep(2)
				except asyncio.CancelledError:
					break
				except Exception:
					await asyncio.sleep(2)
		finally:
			with suppress(Exception):
				db_session.close()
			with suppress(Exception):
				db_gen.close()

	return StreamingResponse(
		event_generator(),
		media_type="text/event-stream",
		headers={
			"Cache-Control": "no-cache",
			"Connection": "keep-alive",
			"X-Accel-Buffering": "no",
		},
	)


@router.get("/categories/with-subcategories")
def get_categories_with_subcategories(db: Session = Depends(get_db)):
	"""Obtiene todas las categorías con sus subcategorías"""
	categories = db.execute(
		text("SELECT IdCategoria, Nombre, Descripcion FROM Categoria ORDER BY IdCategoria")
	).mappings().all()
	
	result = []
	for cat in categories:
		cat_id = cat.get("IdCategoria")
		result.append({
			"id": cat_id,
			"nombre": cat.get("Nombre"),
			"descripcion": cat.get("Descripcion"),
			"subcategories": get_subcategories_by_category(cat_id, db)
		})
	
	return result


@router.get("/{incident_id}")
def get_incident(incident_id: int, db: Session = Depends(get_db)):
	item = db.query(Incident).filter(Incident.IdIncidencia == incident_id).first()
	if not item:
		raise HTTPException(status_code=404, detail="Incidencia no encontrada")
	return map_row_to_frontend(item, db)


@router.post("", status_code=201)
def create_incident(payload: IncidentCreate, db: Session = Depends(get_db)):
	category_id = map_category_to_id(payload.category)
	
	# Si viene subcategoryId, validar que existe y pertenece a la categoría
	subcategory_id = None
	subcategory_name = None
	if payload.subcategoryId:
		subcategory = db.query(Subcategory).filter(
			Subcategory.IdSubcategoria == payload.subcategoryId,
			Subcategory.IdCategoria == category_id
		).first()
		if subcategory:
			subcategory_id = payload.subcategoryId
			subcategory_name = subcategory.Nombre

	title = build_incident_title(payload, subcategory_name)
	
	created = Incident(
		Titulo=title.strip(),
		Descripcion=payload.description.strip(),
		Prioridad=normalize_priority(payload.priority or "media"),
		Direccion=payload.location.strip(),
		IdUsuarioCreador=payload.userId or 1,
		IdCategoria=category_id,
		IdSubcategoria=subcategory_id,
		IdServicio=None,
		IdTecnicoAsignado=None,
		Estado="Pendiente",
	)

	db.add(created)
	db.commit()
	db.refresh(created)

	return map_row_to_frontend(created, db)


@router.put("/{incident_id}/status")
def update_incident_status(incident_id: int, payload: IncidentStatusUpdate, db: Session = Depends(get_db)):
	item = db.query(Incident).filter(Incident.IdIncidencia == incident_id).first()
	if not item:
		raise HTTPException(status_code=404, detail="Incidencia no encontrada")

	item.Estado = normalize_status_to_db(payload.status)
	db.commit()
	db.refresh(item)

	return map_row_to_frontend(item, db)


@router.put("/{incident_id}/assign")
def assign_technician_to_incident(incident_id: int, payload: IncidentAssignTechnicianPayload, db: Session = Depends(get_db)):
	item = db.query(Incident).filter(Incident.IdIncidencia == incident_id).first()
	if not item:
		raise HTTPException(status_code=404, detail="Incidencia no encontrada")

	technician = db.execute(
		text("SELECT IdUsuario, IdRol, EstadoCuenta FROM Usuario WHERE IdUsuario = :id"),
		{"id": payload.technicianId},
	).mappings().first()

	if not technician:
		raise HTTPException(status_code=404, detail="Tecnico no encontrado")

	if int(technician.get("IdRol") or 0) != 2:
		raise HTTPException(status_code=422, detail="El usuario seleccionado no es tecnico")

	if not bool(technician.get("EstadoCuenta")):
		raise HTTPException(status_code=422, detail="El tecnico seleccionado no esta activo")

	if item.IdTecnicoAsignado and int(item.IdTecnicoAsignado) != int(payload.technicianId):
		raise HTTPException(status_code=409, detail="La incidencia ya tiene un tecnico asignado")

	item.IdTecnicoAsignado = payload.technicianId
	if (item.Estado or "").strip() == "Pendiente":
		item.Estado = "Asignada"

	db.commit()
	db.refresh(item)

	return map_row_to_frontend(item, db)
