from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import traceback

app = FastAPI()

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

# Importar y registrar routers si existen
try:
	from app.routes import users, incidents, admin
	app.include_router(users.router, prefix="/api/users")
	app.include_router(incidents.router, prefix="/api/incidents")
	app.include_router(admin.router, prefix="/api/admin")
	print("✓ Routers importados correctamente")
except Exception as e:
	print(f"✗ Error importando routers: {e}")
	traceback.print_exc()

@app.get("/")
def read_root():
	return {"message": "Backend funcionando"}
