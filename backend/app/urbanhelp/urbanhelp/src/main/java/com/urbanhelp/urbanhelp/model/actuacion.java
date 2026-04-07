package com.urbanhelp.urbanhelp.model;

import java.util.Date;

public class actuacion {

    private int idActuacion;
    private String descripcion;
    private Date fechaActuacion;
    private Date fechaFin;
    private String materialesUtilizados;
    private String observaciones;

    public actuacion() {
    }

    public actuacion(int idActuacion, String descripcion, Date fechaActuacion, Date fechaFin,
            String materialesUtilizados, String observaciones) {
        this.idActuacion = idActuacion;
        this.descripcion = descripcion;
        this.fechaActuacion = fechaActuacion;
        this.fechaFin = fechaFin;
        this.materialesUtilizados = materialesUtilizados;
        this.observaciones = observaciones;
    }

    public int getIdActuacion() {
        return idActuacion;
    }

    public void setIdActuacion(int idActuacion) {
        this.idActuacion = idActuacion;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Date getFechaActuacion() {
        return fechaActuacion;
    }

    public void setFechaActuacion(Date fechaActuacion) {
        this.fechaActuacion = fechaActuacion;
    }

    public Date getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(Date fechaFin) {
        this.fechaFin = fechaFin;
    }

    public String getMaterialesUtilizados() {
        return materialesUtilizados;
    }

    public void setMaterialesUtilizados(String materialesUtilizados) {
        this.materialesUtilizados = materialesUtilizados;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

}
