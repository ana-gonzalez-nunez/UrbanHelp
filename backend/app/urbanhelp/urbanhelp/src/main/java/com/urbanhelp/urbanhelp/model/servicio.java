package com.urbanhelp.urbanhelp.model;



public class servicio {
    private int idServicio;
    private String nombre;
    private String ubicacion;
    private String telefono;
    private String tipoServicio;

    public servicio() {
    }

    public servicio(int idServicio, String nombre, String ubicacion, String telefono, String tipoServicio) {
        this.idServicio = idServicio;
        this.nombre = nombre;
        this.ubicacion = ubicacion;
        this.telefono = telefono;
        this.tipoServicio = tipoServicio;
    }

    public int getIdServicio() {
        return idServicio;
    }

    public void setIdServicio(int idServicio) {
        this.idServicio = idServicio;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getTipoServicio() {
        return tipoServicio;
    }

    public void setTipoServicio(String tipoServicio) {
        this.tipoServicio = tipoServicio;
    }

}
