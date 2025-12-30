package com.fivekicks.football.controller;

import com.fivekicks.football.dto.TournamentDto;
import com.fivekicks.football.service.TournamentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tournaments")
public class TournamentController {

    private final TournamentService tournamentService;

    public TournamentController(TournamentService tournamentService) {
        this.tournamentService = tournamentService;
    }

    @GetMapping
    public ResponseEntity<List<TournamentDto>> getAllTournaments() {
        return ResponseEntity.ok(tournamentService.getAllTournaments());
    }

    @PostMapping("/{tournamentId}/join")
    public ResponseEntity<?> joinTournament(@PathVariable Long tournamentId, @RequestBody Map<String, Long> payload) {
        Long teamId = payload.get("teamId");
        if (teamId == null) {
            return ResponseEntity.badRequest().body("teamId is required");
        }
        tournamentService.joinTournament(tournamentId, teamId);
        return ResponseEntity.ok().body(Map.of("message", "Joined successfully"));
    }
}
