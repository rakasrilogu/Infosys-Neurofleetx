package ai.neurofleetx.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable)

            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration config = new CorsConfiguration();

                config.setAllowedOriginPatterns(List.of(
                        "http://localhost:3000",
                        "https://infosys-neurofleetx.vercel.app"
                ));

                config.setAllowedMethods(List.of(
                        "GET", "POST", "PUT", "DELETE", "OPTIONS"
                ));

                config.setAllowedHeaders(List.of("*"));
                config.setAllowCredentials(true);

                return config;
            }))

            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            .authorizeHttpRequests(auth -> auth

                // ✅ Allow root (Render health check)
                .requestMatchers("/", "/error").permitAll()

                // Allow OPTIONS
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Public endpoints
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/routes/**").permitAll()
                .requestMatchers("/api/geocode/**").permitAll()

                // WebSocket
                .requestMatchers("/ws/**").permitAll()
                .requestMatchers("/topic/**").permitAll()
                .requestMatchers("/app/**").permitAll()

                // Protected endpoints
                .requestMatchers("/api/vehicles/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers("/api/bookings/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                .anyRequest().authenticated()
            )

            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}
