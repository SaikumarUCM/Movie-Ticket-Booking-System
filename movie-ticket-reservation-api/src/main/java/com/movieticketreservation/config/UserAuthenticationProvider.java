package com.movieticketreservation.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.movieticketreservation.dto.AdminDto;
import com.movieticketreservation.dto.CustomerDto;
import com.movieticketreservation.exception.AdminNotFoundException;
import com.movieticketreservation.exception.CustomerNotFoundException;
import com.movieticketreservation.service.AdminService;
import com.movieticketreservation.service.CustomerService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.*;

@RequiredArgsConstructor
@Component
public class UserAuthenticationProvider {

    private final AdminService adminService;
    private final CustomerService customerService;
    @Value("${jwt.secret}")
    private String secretKey;

    @PostConstruct
    protected void init() {
        // this is to avoid having the raw secret key available in the JVM
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }

    public String createToken(String login, String userId, String role) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + 24 * 3600000); // 1 hour

        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        return JWT.create()
                .withSubject(login)
                .withClaim("userId", userId)
                .withClaim("role", role)
                .withIssuedAt(now)
                .withExpiresAt(validity)
                .sign(algorithm);
    }

    public Authentication validateToken(String token) throws
            AdminNotFoundException, CustomerNotFoundException {
        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        AdminDto adminDto = null;
        CustomerDto customerDto = null;

        JWTVerifier verifier = JWT.require(algorithm)
                .build();

        DecodedJWT decoded = verifier.verify(token);
        String role = decoded.getClaim("role").asString();
        List<GrantedAuthority> authorities = new ArrayList<>();

        switch (role) {
            case "ROLE_ADMIN" -> {
                adminDto = adminService.findByEmail(decoded.getSubject());
                authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
                adminDto.setAuthorities(authorities);
                adminDto.setUsername(decoded.getSubject()); // Set the username
            }
            case "ROLE_CUSTOMER" -> {
                customerDto = customerService.findByEmail(decoded.getSubject());
                authorities.add(new SimpleGrantedAuthority("ROLE_CUSTOMER"));
                customerDto.setAuthorities(authorities);
                customerDto.setUsername(decoded.getSubject()); // Set the username
            }
            default ->
                // Handle unknown roles. For example, log a warning.
                    System.out.println("Unknown role: " + role);

            // You can throw an exception or handle the case as appropriate for your application.
            // For now, let's assume the user has no authorities.
        }

        return new UsernamePasswordAuthenticationToken(role.equals("ROLE_ADMIN")
                ? adminDto : customerDto, null, Collections.emptyList());
    }
}
