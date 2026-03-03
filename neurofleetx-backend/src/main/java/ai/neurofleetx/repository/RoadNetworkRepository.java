package ai.neurofleetx.repository;

import ai.neurofleetx.model.RoadNetwork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoadNetworkRepository extends JpaRepository<RoadNetwork, Long> {
    // JpaRepository provides .findAll() automatically to load all roads into the graph
}