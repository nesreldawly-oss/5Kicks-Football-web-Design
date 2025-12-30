package com.fivekicks.football.service;

import com.fivekicks.football.dto.TeamDto;
import com.fivekicks.football.entity.Role;
import com.fivekicks.football.entity.Team;
import com.fivekicks.football.entity.User;
import com.fivekicks.football.repository.TeamRepository;
import com.fivekicks.football.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final UserRepository userRepository;

    public TeamService(TeamRepository teamRepository, UserRepository userRepository) {
        this.teamRepository = teamRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public TeamDto createTeam(String name, String ownerEmail) {
        User user = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (teamRepository.existsByName(name)) {
            throw new IllegalArgumentException("Team name already exists");
        }

        Team team = new Team();
        team.setName(name);
        team.setCaptain(user);

        // Initialize other stats
        team.setWins(0);
        team.setDraws(0);
        team.setLosses(0);
        team.setPoints(0);
        team.setGoalsScored(0);
        team.setGoalsConceded(0);
        team.setCleanSheets(0);

        Team savedTeam = teamRepository.save(team);

        // Update user's role to TEAM_CAPTAIN if currently just USER
        if (user.getRole() == Role.USER) {
            user.setRole(Role.TEAM_CAPTAIN);
            userRepository.save(user);
        }

        return mapToDto(savedTeam);
    }

    public List<TeamDto> getMyTeams(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // For now, return teams where user is captain.
        // Later can extend to teams where user is just a member.
        List<Team> teams = teamRepository.findByCaptain(user);
        return teams.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private TeamDto mapToDto(Team team) {
        TeamDto dto = new TeamDto();
        dto.setId(team.getId());
        dto.setName(team.getName());
        dto.setLogo(team.getLogoUrl());
        // For now assuming 1 player (the captain) until member logic is added
        dto.setPlayerCount(1);
        dto.setWins(team.getWins());
        dto.setDraws(team.getDraws());
        dto.setLosses(team.getLosses());
        dto.setPoints(team.getPoints());
        dto.setGoalsScored(team.getGoalsScored());
        dto.setGoalsConceded(team.getGoalsConceded());
        return dto;
    }
}
