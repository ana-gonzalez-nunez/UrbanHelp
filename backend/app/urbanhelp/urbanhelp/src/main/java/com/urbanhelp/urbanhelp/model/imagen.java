package com.urbanhelp.urbanhelp.model;

import java.util.Date;

public class imagen {

    
    private int idImagen;
    private String url;
    private Date fechaSubida;
    private int idIncidencia;

    public imagen() {
    }

    public imagen(int idImagen, String url, Date fechaSubida, int idIncidencia) {
        this.idImagen = idImagen;
        this.url = url;
        this.fechaSubida = fechaSubida;
        this.idIncidencia = idIncidencia;
    }

    public int getIdImagen() {
        return idImagen;
    }

    public void setIdImagen(int idImagen) {
        this.idImagen = idImagen;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
    public Date getFechaSubida() {
        return fechaSubida;
    }   

    public void setFechaSubida(Date fechaSubida) {
        this.fechaSubida = fechaSubida;
    }
    
    public int getIdIncidencia() {
        return idIncidencia;
    }

    public void setIdIncidencia(int idIncidencia) {
        this.idIncidencia = idIncidencia;
    }
}
