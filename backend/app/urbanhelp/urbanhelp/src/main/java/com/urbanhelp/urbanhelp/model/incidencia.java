package com.urbanhelp.urbanhelp.model;

import java.util.Date;

public class incidencia {

    private int idIncidencia;
    private String titulo;
    private String descripcion;
    private Date fechaCreacion;
    private Date fechaCierre;
    private String prioridad;// para enums es igual?
    private String estado;// para enums es igual?
    private String direccion;

    public incidencia() {
    }

    public incidencia(int idIncidencia, String titulo, String descripcion, Date fechaCreacion, Date fechaCierre,
            String prioridad, String estado, String direccion) {
        this.idIncidencia = idIncidencia;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.fechaCreacion = fechaCreacion;
        this.fechaCierre = fechaCierre;
        this.prioridad = prioridad;
        this.estado = estado;
        this.direccion = direccion;
    }

    public int getIdIncidencia() {
        return idIncidencia;
    }

    public void setIdIncidencia(int idIncidencia) {
        this.idIncidencia = idIncidencia;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Date getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(Date fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public Date getFechaCierre() {
        return fechaCierre;
    }

    public void setFechaCierre(Date fechaCierre) {
        this.fechaCierre = fechaCierre;
    }

    public String getPrioridad() {
        return prioridad;
    }

    public void setPrioridad(String prioridad) {
        this.prioridad = prioridad;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

}
