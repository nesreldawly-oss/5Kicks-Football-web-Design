package com.fivekicks.football.dto;

import java.util.List;

public class TournamentDto {
    private Long id;
    private String name;
    private String status; // "registration_open", "upcoming", "live"
    private String startDate;
    private String endDate;
    private String location;
    private LocationDetails locationDetails;
    private int teamsRegistered;
    private int maxTeams;
    private int prizePool;
    private int registrationFee;
    private String about;
    private List<String> rules;

    // Getters Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocationDetails getLocationDetails() {
        return locationDetails;
    }

    public void setLocationDetails(LocationDetails locationDetails) {
        this.locationDetails = locationDetails;
    }

    public int getTeamsRegistered() {
        return teamsRegistered;
    }

    public void setTeamsRegistered(int teamsRegistered) {
        this.teamsRegistered = teamsRegistered;
    }

    public int getMaxTeams() {
        return maxTeams;
    }

    public void setMaxTeams(int maxTeams) {
        this.maxTeams = maxTeams;
    }

    public int getPrizePool() {
        return prizePool;
    }

    public void setPrizePool(int prizePool) {
        this.prizePool = prizePool;
    }

    public int getRegistrationFee() {
        return registrationFee;
    }

    public void setRegistrationFee(int registrationFee) {
        this.registrationFee = registrationFee;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    public List<String> getRules() {
        return rules;
    }

    public void setRules(List<String> rules) {
        this.rules = rules;
    }

    public static class LocationDetails {
        private String name;
        private String address;
        private Coordinates coordinates;

        public LocationDetails(String name, String address, double lat, double lng) {
            this.name = name;
            this.address = address;
            this.coordinates = new Coordinates(lat, lng);
        }

        public String getName() {
            return name;
        }

        public String getAddress() {
            return address;
        }

        public Coordinates getCoordinates() {
            return coordinates;
        }
    }

    public static class Coordinates {
        private double lat;
        private double lng;

        public Coordinates(double lat, double lng) {
            this.lat = lat;
            this.lng = lng;
        }

        public double getLat() {
            return lat;
        }

        public double getLng() {
            return lng;
        }
    }
}
