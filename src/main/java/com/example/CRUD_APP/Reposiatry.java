package com.example.CRUD_APP;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface Reposiatry extends JpaRepository<Product , Long> {

    // Find by description and sort by ID in ascending order
    List<Product> findByDescriptionContainingIgnoreCaseOrderByIdAsc(String description);

    // Find by description and sort by ID in descending order
    List<Product> findByDescriptionContainingIgnoreCaseOrderByIdDesc(String description);

    // Find by description without sorting
    List<Product> findByDescriptionContainingIgnoreCase(String description);
}
