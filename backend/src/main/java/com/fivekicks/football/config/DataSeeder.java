package com.fivekicks.football.config;

import com.fivekicks.football.entity.Tournament;
import com.fivekicks.football.entity.TournamentStatus;
import com.fivekicks.football.repository.TournamentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataSeeder implements CommandLineRunner {

    private final TournamentRepository tournamentRepository;

    public DataSeeder(TournamentRepository tournamentRepository) {
        this.tournamentRepository = tournamentRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (tournamentRepository.count() == 0) {
            createTournament("Cairo Summer Cup", TournamentStatus.REGISTRATION_OPEN);
            createTournament("Ramadan League", TournamentStatus.UPCOMING);
            createTournament("University Championship", TournamentStatus.LIVE);
        }
    }

    private void createTournament(String name, TournamentStatus status) {
        Tournament t = new Tournament();
        t.setName(name);
        t.setStatus(status);
        t.setStartDate(LocalDate.now().plusDays(7));
        t.setEndDate(LocalDate.now().plusDays(10));
        t.setLocation("Cairo Stadium");
        t.setMaxTeams(16);
        t.setRegistrationFee(500);
        t.setPrizePool(10000);
        t.setAbout("A thrilling tournament.");
        tournamentRepository.save(t);
    }
}
