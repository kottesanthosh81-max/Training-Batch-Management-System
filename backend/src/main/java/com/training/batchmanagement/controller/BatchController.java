package com.training.batchmanagement.controller;

import com.training.batchmanagement.dto.ApiResponse;
import com.training.batchmanagement.dto.BatchRequest;
import com.training.batchmanagement.dto.BatchResponse;
import com.training.batchmanagement.dto.DashboardStatsResponse;
import com.training.batchmanagement.dto.StudentResponse;
import com.training.batchmanagement.service.BatchService;
import com.training.batchmanagement.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/batches")
public class BatchController {

    private final BatchService batchService;
    private final StudentService studentService;

    public BatchController(BatchService batchService, StudentService studentService) {
        this.batchService = batchService;
        this.studentService = studentService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BatchResponse>> createBatch(@Valid @RequestBody BatchRequest request) {
        BatchResponse response = batchService.createBatch(request);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Training batch created successfully!", response),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BatchResponse>>> getAllBatches() {
        List<BatchResponse> batches = batchService.getAllBatches();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Batches retrieved successfully", batches)
        );
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        DashboardStatsResponse stats = batchService.getDashboardStats();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Dashboard metrics retrieved successfully", stats)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BatchResponse>> getBatchById(@PathVariable Long id) {
        BatchResponse batch = batchService.getBatchById(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Batch retrieved successfully", batch)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BatchResponse>> updateBatch(
            @PathVariable Long id,
            @Valid @RequestBody BatchRequest request) {
        BatchResponse updated = batchService.updateBatch(id, request);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Batch updated successfully!", updated)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBatch(@PathVariable Long id) {
        batchService.deleteBatch(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Batch deleted successfully!")
        );
    }

    @GetMapping("/{id}/students")
    public ResponseEntity<ApiResponse<List<StudentResponse>>> getStudentsByBatch(@PathVariable Long id) {
        List<StudentResponse> students = studentService.getStudentsByBatchId(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Students for batch retrieved successfully", students)
        );
    }
}
