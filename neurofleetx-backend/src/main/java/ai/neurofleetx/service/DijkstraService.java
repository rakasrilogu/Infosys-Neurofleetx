package ai.neurofleetx.service;

import ai.neurofleetx.model.Edge;
import ai.neurofleetx.model.Node;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class DijkstraService {

    public void computePaths(Node source) {
        source.setMinDistance(0);
        PriorityQueue<Node> vertexQueue = new PriorityQueue<>(Comparator.comparingDouble(Node::getMinDistance));
        vertexQueue.add(source);

        while (!vertexQueue.isEmpty()) {
            Node u = vertexQueue.poll();

            for (Edge e : u.getAdjacencies()) {
                Node v = e.getTarget();
                double weight = e.getWeight();
                double distanceThroughU = u.getMinDistance() + weight;
                
                if (distanceThroughU < v.getMinDistance()) {
                    vertexQueue.remove(v);
                    v.setMinDistance(distanceThroughU);
                    v.setPrevious(u);
                    vertexQueue.add(v);
                }
            }
        }
    }

    public List<Node> getShortestPathTo(Node target) {
        List<Node> path = new ArrayList<>();
        for (Node node = target; node != null; node = node.getPrevious()) {
            path.add(node);
        }
        Collections.reverse(path);
        return path;
    }
}