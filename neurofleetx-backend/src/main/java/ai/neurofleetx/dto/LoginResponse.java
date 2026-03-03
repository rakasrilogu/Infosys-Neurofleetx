package ai.neurofleetx.dto;

public class LoginResponse {

    private String token;
    private String role;
    private String name;
    private String message;

    public LoginResponse(String token, String role, String name, String message) {
        this.token = token;
        this.role = role;
        this.name = name;
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public String getRole() {
        return role;
    }

    public String getName() {
        return name;
    }

    public String getMessage() {
        return message;
    }
}
