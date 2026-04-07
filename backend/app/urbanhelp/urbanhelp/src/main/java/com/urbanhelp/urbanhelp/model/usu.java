package com.urbanhelp.urbanhelp.model;

import java.util.Date;

public class usu {
    private int id;
    private String nombre;
    private String ape1;
    private String ape2;
    private String email;
    private String password;
    private String telefono;
    private Date fecha_registro;
    private boolean estadoCuenta;

    public usu() {
    }

    public usu(int id, String nombre, String ape1, String ape2, String email, String password, String telefono,
            Date fecha_registro, boolean estadoCuenta) {
        this.id = id;
        this.nombre = nombre;
        this.ape1 = ape1;
        this.ape2 = ape2;
        this.email = email;
        this.password = password;
        this.telefono = telefono;
        this.fecha_registro = fecha_registro;
        this.estadoCuenta = estadoCuenta;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApe1() {
        return ape1;
    }

    public void setApe1(String ape1) {
        this.ape1 = ape1;
    }

    public String getApe2() {
        return ape2;
    }

    public void setApe2(String ape2) {
        this.ape2 = ape2;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public Date getFecha_registro() {
        return fecha_registro;
    }

    public void setFecha_registro(Date fecha_registro) {
        this.fecha_registro = fecha_registro;
    }

    public boolean isEstadoCuenta() {
        return estadoCuenta;
    }

    public void setEstadoCuenta(boolean estadoCuenta) {
        this.estadoCuenta = estadoCuenta;
    }

}
