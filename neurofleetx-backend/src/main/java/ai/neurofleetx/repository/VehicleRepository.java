package ai.neurofleetx.repository;

import ai.neurofleetx.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {

    // ✅ FIXED: Changed v.vehicleId to v.id
    @Query("SELECT v FROM Vehicle v WHERE v.availabilityStatus = 'AVAILABLE' AND v.id NOT IN :excludedIds")
    List<Vehicle> findAvailableVehiclesExcluding(@Param("excludedIds") List<Integer> excludedIds);

    List<Vehicle> findByAvailabilityStatus(String status);

    @Query("SELECT v FROM Vehicle v WHERE LOWER(v.name) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Vehicle> searchByName(@Param("search") String search);
}