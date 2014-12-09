package com.xekm.mmo.server;

public class LocationObject {

    private String userName;
    private double x;
    private double y;

    public LocationObject() {
        //needed for json
    }

    public LocationObject(String userName, double x, double y) {
        this.userName = userName;
        this.x = x;
        this.y = y;
    }

    public String getUserName() {
        return userName;
    }

    public double getX() {
        return x;
    }

    public double getY() {
        return y;
    }

    @Override
    public String toString() {
        return "LocationObject{" +
                "userName='" + userName + '\'' +
                ", x=" + x +
                ", y=" + y +
                '}';
    }
}