package ai.neurofleetx.model;

import java.util.*;

public class Node {
    private String name;
    private List<Edge> adjacencies = new ArrayList<>();
    private double minDistance = Double.POSITIVE_INFINITY;
    private Node previous;

    public Node(String name) { this.name = name; }

    public void addEdge(Edge edge) { adjacencies.add(edge); }

    // Getters and Setters
    public String getName() { return name; }
    public List<Edge> getAdjacencies() { return adjacencies; }
    public double getMinDistance() { return minDistance; }
    public void setMinDistance(double minDistance) { this.minDistance = minDistance; }
    public Node getPrevious() { return previous; }
    public void setPrevious(Node previous) { this.previous = previous; }

    @Override
    public String toString() { return name; }
}