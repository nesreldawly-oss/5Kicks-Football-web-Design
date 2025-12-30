package com.fivekicks.football.repository;

import com.fivekicks.football.entity.Team;
import com.fivekicks.football.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    List<Team> findByCaptain(User captain);

    boolean existsByName(String name);
}
