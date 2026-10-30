package com.cpm.repository;

import com.cpm.entity.User;
import com.cpm.entity.Role;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailIgnoreCase(String email);
    Boolean existsByEmail(String email);
    List<User> findByRole(Role role);
    long countByRole(Role role);
}
