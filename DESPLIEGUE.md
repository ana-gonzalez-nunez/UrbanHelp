# Guía de Despliegue — UrbanHelp

## Requisitos previos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y arrancado
- [ngrok](https://ngrok.com/download) instalado (para URL pública)

---

## 1. Levantar el proyecto con Docker

```bash
# Desde la raíz del proyecto (donde está docker-compose.yml)
docker-compose up -d --build
```

Espera ~30 segundos a que la base de datos arranque. Comprueba que todo funciona:
- Frontend: http://localhost:8081
- Backend API: http://localhost:8080/api
- Cuentas demo: user@urbanhelp.es / tecnico@urbanhelp.es / admin@urbanhelp.es (contraseña: 123456)

---

## 2. Exponer con ngrok para que el profesor lo vea

### Instalar ngrok
- **Windows**: Descarga el .exe desde https://ngrok.com/download o `winget install ngrok`
- **Mac**: `brew install ngrok`
- **Linux**: `snap install ngrok`

### Crear cuenta gratuita
1. Regístrate en https://dashboard.ngrok.com
2. Copia tu authtoken desde el dashboard
3. Configúralo: `ngrok config add-authtoken TU_TOKEN_AQUI`

### Exponer el frontend
```bash
ngrok http 8081
```

Ngrok mostrará algo así:
```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:8081
```

**Esa URL `https://abc123.ngrok-free.app` es la que le pasas al profesor.** Funciona mientras ngrok esté corriendo.

---

## 3. Parar el proyecto

```bash
docker-compose down
```

Para borrar también los datos de la base de datos:
```bash
docker-compose down -v
```

---

## Solución de problemas

| Problema | Solución |
|---|---|
| Puerto 8080 o 8081 ocupado | Cambia los puertos en `docker-compose.yml` |
| La BD tarda en arrancar | Espera 30-60 s y recarga |
| ngrok cierra al cerrar el terminal | Usa `ngrok http 8081 &` o déjalo en una terminal separada |
| El profesor ve "sitio no seguro" | Es normal con ngrok gratuito, puede hacer click en "Visitar de todas formas" |
