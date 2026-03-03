package ai.neurofleetx.repository;

import ai.neurofleetx.model.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    // Focused only on saving the calculated route results
}