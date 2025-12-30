package com.fivekicks.football.service;

import com.fivekicks.football.dto.TournamentDto;
import com.fivekicks.football.entity.Team;
import com.fivekicks.football.entity.Tournament;
import com.fivekicks.football.entity.TournamentStatus;
import com.fivekicks.football.repository.TeamRepository;
import com.fivekicks.football.repository.TournamentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TournamentService {

    private final TournamentRepository tournamentRepository;
    private final TeamRepository teamRepository;

    public TournamentService(TournamentRepository tournamentRepository, TeamRepository teamRepository) {
        this.tournamentRepository = tournamentRepository;
        this.teamRepository = teamRepository;
    }

    public List<TournamentDto> getAllTournaments() {
        return tournamentRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void joinTournament(Long tournamentId, Long teamId) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));

        if (tournament.getTeams().contains(team)) {
            throw new IllegalArgumentException("Team already joined");
        }

        tournament.getTeams().add(team);
        tournamentRepository.save(tournament);
    }

    private TournamentDto mapToDto(Tournament t) {
        TournamentDto dto = new TournamentDto();
        dto.setId(t.getId());
        dto.setName(t.getName());

        // Map status
        String status = "upcoming";
        if (t.getStatus() == TournamentStatus.REGISTRATION_OPEN)
            status = "registration_open";
        else if (t.getStatus() == TournamentStatus.LIVE)
            status = "live";
        else if (t.getStatus() == TournamentStatus.COMPLETED)
            status = "completed";
        dto.setStatus(status);

        dto.setStartDate(t.getStartDate() != null ? t.getStartDate().toString() : "TBD");
        dto.setEndDate(t.getEndDate() != null ? t.getEndDate().toString() : "TBD");

        dto.setLocation("Cairo");
        dto.setLocationDetails(new TournamentDto.LocationDetails(
                "Cairo Stadium", "Nasr City, Cairo", 30.0, 31.0));

        dto.setTeamsRegistered(t.getTeams().size());
        dto.setMaxTeams(16);
        dto.setPrizePool(50000);
        dto.setRegistrationFee(500);
        dto.setAbout("Join the biggest amateur league in Cairo.");
        dto.setRules(Collections.singletonList("5v5 Format"));

        return dto;
    }
}
