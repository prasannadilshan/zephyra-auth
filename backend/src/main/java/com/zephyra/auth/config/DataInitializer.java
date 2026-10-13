package com.zephyra.auth.config;

import com.zephyra.auth.model.ERole;
import com.zephyra.auth.model.Role;
import com.zephyra.auth.model.User;
import com.zephyra.auth.repository.RoleRepository;
import com.zephyra.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Initializing roles and default test accounts...");

        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseGet(() -> roleRepository.save(new Role(ERole.ROLE_USER)));

        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                .orElseGet(() -> roleRepository.save(new Role(ERole.ROLE_ADMIN)));

        if (!userRepository.existsByUsername("admin") && !userRepository.existsByEmail("admin@zephyra.com")) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@zephyra.com")
                    .password(passwordEncoder.encode("Admin@123456"))
                    .roles(Set.of(userRole, adminRole))
                    .enabled(true)
                    .build();
            userRepository.save(admin);
            log.info("Default Admin account seeded: admin@zephyra.com / Admin@123456");
        }

        if (!userRepository.existsByUsername("user") && !userRepository.existsByEmail("user@zephyra.com")) {
            User user = User.builder()
                    .username("user")
                    .email("user@zephyra.com")
                    .password(passwordEncoder.encode("User@123456"))
                    .roles(Set.of(userRole))
                    .enabled(true)
                    .build();
            userRepository.save(user);
            log.info("Default User account seeded: user@zephyra.com / User@123456");
        }

        log.info("System data initialization complete.");
    }
}
