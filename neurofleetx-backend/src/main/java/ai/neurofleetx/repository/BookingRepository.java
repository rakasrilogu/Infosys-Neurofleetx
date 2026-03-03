package ai.neurofleetx.repository;

import ai.neurofleetx.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // ✅ Match the 'bookingId' and 'createdAt' fields
    List<Booking> findTop10ByOrderByCreatedAtDesc();

    // ✅ Match 'customerPhone' field name
    @Query("SELECT b.vehicle.id FROM Booking b WHERE b.customerPhone = :phone")
    List<Integer> findBookedVehicleIdsByCustomerPhone(@Param("phone") String phone);
}