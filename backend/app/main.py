from fastapi import FastAPI

app = FastAPI()

# Importar y registrar routers si existen
try:
	from app.routes import users, incidents, admin
	app.include_router(users.router, prefix="/users")
	app.include_router(incidents.router, prefix="/incidents")
	app.include_router(admin.router, prefix="/admin")
except Exception:
	pass  # Si los routers no existen, continuar

@app.get("/")
def read_root():
	return {"message": "Backend funcionando"}
