#!/bin/bash
# ============================================================
# Tema 6: Script de backup con rotación automática
# Programar con cron: 0 3 * * * /ruta/backup.sh
# ============================================================

FECHA=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
RETENTION_DAYS=7
CONTAINER="proyectos2-db"
DB_USER="urbanhelp_backup"
DB_PASS="BackupPass_2024!"
DB_NAME="UrbanHelp"

mkdir -p "${BACKUP_DIR}"

echo "[$(date)] Iniciando backup de ${DB_NAME}..."

# --single-transaction: snapshot consistente sin bloquear tablas InnoDB
# --routines:           incluye stored procedures (sp_cambiar_estado, etc.)
# --triggers:           incluye triggers de auditoría
# --set-gtid-purged=OFF: evita problemas si no se usa replicación GTID
docker exec "${CONTAINER}" mysqldump \
  -u"${DB_USER}" -p"${DB_PASS}" \
  --databases "${DB_NAME}" \
  --single-transaction \
  --routines --triggers \
  --set-gtid-purged=OFF \
  | gzip > "${BACKUP_DIR}/backup_${FECHA}.sql.gz"

if [ $? -eq 0 ]; then
  echo "[$(date)] Backup completado: backup_${FECHA}.sql.gz"
else
  echo "[$(date)] ERROR: el backup falló" >&2
  exit 1
fi

# Eliminar backups con más de RETENTION_DAYS días
find "${BACKUP_DIR}" -name "backup_*.sql.gz" -mtime +${RETENTION_DAYS} -delete
echo "[$(date)] Backups de más de ${RETENTION_DAYS} días eliminados."
