package com.fivekicks.football.controller;

import com.fivekicks.football.dto.TeamDto;
import com.fivekicks.football.service.TeamService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @PostMapping
    public ResponseEntity<TeamDto> createTeam(@RequestBody TeamDto.CreateTeamRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(teamService.createTeam(request.getName(), userEmail));
    }

    @GetMapping("/my")
    public ResponseEntity<List<TeamDto>> getMyTeams(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(teamService.getMyTeams(userEmail));
    }
}
