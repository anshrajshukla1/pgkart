package com.pgkart.repositories;

import com.pgkart.model.AppRole;
import com.pgkart.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByRoleName(AppRole roleName);
}
