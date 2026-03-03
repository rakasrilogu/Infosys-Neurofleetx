package ai.neurofleetx.dto;

import lombok.*;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WebSocketRouteDTO {
    private String routeId;
    private List<List<Double>> coordinates;
    private double distance;
    private double duration;
}
