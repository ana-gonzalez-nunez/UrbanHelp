FROM nginx:1.27-alpine

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

COPY login.html /usr/share/nginx/html/
COPY registro.html /usr/share/nginx/html/
COPY admin.html /usr/share/nginx/html/
COPY incidencia-detalle.html /usr/share/nginx/html/
COPY tecnico.html /usr/share/nginx/html/
COPY user-incidencia-detalle.html /usr/share/nginx/html/
COPY user-incidencias.html /usr/share/nginx/html/
COPY user-nueva-incidencia.html /usr/share/nginx/html/
COPY user-perfil.html /usr/share/nginx/html/
COPY user.html /usr/share/nginx/html/

COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js
COPY Imganes /usr/share/nginx/html/Imganes

EXPOSE 80
