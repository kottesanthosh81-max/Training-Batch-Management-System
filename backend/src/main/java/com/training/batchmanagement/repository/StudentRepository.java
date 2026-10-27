package com.training.batchmanagement.repository;

import com.training.batchmanagement.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    List<Student> findByBatchIdOrderByCreatedAtDesc(Long batchId);

    List<Student> findByRollNumberIgnoreCase(String rollNumber);

    boolean existsByBatchIdAndRollNumberIgnoreCase(Long batchId, String rollNumber);

    Optional<Student> findByBatchIdAndRollNumberIgnoreCase(Long batchId, String rollNumber);

    long countByBatchId(Long batchId);

    List<Student> findAllByOrderByCreatedAtDesc();
}
