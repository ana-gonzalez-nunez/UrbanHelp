FROM nginx:1.27-alpine

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

COPY admin.html /usr/share/nginx/html/
COPY incidencia-detalle.html /usr/share/nginx/html/
COPY tecnico.html /usr/share/nginx/html/
COPY user-data.js /usr/share/nginx/html/
COPY user-incidencia-detalle.html /usr/share/nginx/html/
COPY user-incidencias.html /usr/share/nginx/html/
COPY user-nueva-incidencia.html /usr/share/nginx/html/
COPY user.html /usr/share/nginx/html/

EXPOSE 80
