package ai.neurofleetx.repository;

import ai.neurofleetx.model.RoadNetwork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadNetworkRepository extends JpaRepository<RoadNetwork, Long> {

    @Query("SELECT r FROM RoadNetwork r WHERE LOWER(r.sourceCity) = LOWER(:city) OR LOWER(r.targetCity) = LOWER(:city)")
    List<RoadNetwork> findByCity(@Param("city") String city);

    @Query("SELECT r FROM RoadNetwork r WHERE (LOWER(r.sourceCity) = LOWER(:city1) AND LOWER(r.targetCity) = LOWER(:city2)) OR (LOWER(r.sourceCity) = LOWER(:city2) AND LOWER(r.targetCity) = LOWER(:city1))")
    RoadNetwork findByCities(@Param("city1") String city1, @Param("city2") String city2);
}
