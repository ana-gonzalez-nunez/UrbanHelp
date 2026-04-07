package com.urbanhelp.urbanhelp.model;

import java.util.Date;

public class HistorialEstado {

    private int idHistorial;
    private String estadoAnterior;// se hace igual con enum?
    private String estadoNuevo;// se hace igual con enum?
    private Date fechaCambio;
    private String comentario;

    public HistorialEstado() {
    }

    public HistorialEstado(int idHistorial, int idIncidencia, String estadoAnterior, String estadoNuevo,
            Date fechaCambio, String comentario) {
        this.idHistorial = idHistorial;
        this.estadoAnterior = estadoAnterior;
        this.estadoNuevo = estadoNuevo;
        this.fechaCambio = fechaCambio;
        this.comentario = comentario;
    }

    public int getIdHistorial() {
        return idHistorial;
    }

    public void setIdHistorial(int idHistorial) {
        this.idHistorial = idHistorial;
    }


    public String getEstadoAnterior() {
        return estadoAnterior;
    }

    public void setEstadoAnterior(String estadoAnterior) {
        this.estadoAnterior = estadoAnterior;
    }

    public String getEstadoNuevo() {
        return estadoNuevo;
    }

    public void setEstadoNuevo(String estadoNuevo) {
        this.estadoNuevo = estadoNuevo;
    }

    public Date getFechaCambio() {
        return fechaCambio;
    }

    public void setFechaCambio(Date fechaCambio) {
        this.fechaCambio = fechaCambio;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

}
