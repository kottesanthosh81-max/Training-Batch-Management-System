package com.training.batchmanagement.service;

import com.training.batchmanagement.dto.BatchRequest;
import com.training.batchmanagement.dto.BatchResponse;
import com.training.batchmanagement.dto.DashboardStatsResponse;
import com.training.batchmanagement.entity.Batch;
import com.training.batchmanagement.exception.BadRequestException;
import com.training.batchmanagement.exception.ResourceNotFoundException;
import com.training.batchmanagement.repository.BatchRepository;
import com.training.batchmanagement.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BatchService {

    private final BatchRepository batchRepository;
    private final StudentRepository studentRepository;

    public BatchService(BatchRepository batchRepository, StudentRepository studentRepository) {
        this.batchRepository = batchRepository;
        this.studentRepository = studentRepository;
    }

    public BatchResponse createBatch(BatchRequest request) {
        Batch batch = new Batch();
        batch.setBatchName(request.getBatchName().trim());
        batch.setCourseName(request.getCourseName().trim());
        batch.setStartDate(request.getStartDate());

        Batch savedBatch = batchRepository.save(batch);
        return mapToResponse(savedBatch, 0);
    }

    @Transactional(readOnly = true)
    public List<BatchResponse> getAllBatches() {
        return batchRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(batch -> {
                    long count = studentRepository.countByBatchId(batch.getId());
                    return mapToResponse(batch, count);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BatchResponse getBatchById(Long id) {
        Batch batch = batchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found with ID: " + id));
        long count = studentRepository.countByBatchId(batch.getId());
        return mapToResponse(batch, count);
    }

    public BatchResponse updateBatch(Long id, BatchRequest request) {
        Batch batch = batchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found with ID: " + id));

        batch.setBatchName(request.getBatchName().trim());
        batch.setCourseName(request.getCourseName().trim());
        batch.setStartDate(request.getStartDate());

        Batch updatedBatch = batchRepository.save(batch);
        long count = studentRepository.countByBatchId(updatedBatch.getId());
        return mapToResponse(updatedBatch, count);
    }

    public void deleteBatch(Long id) {
        Batch batch = batchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found with ID: " + id));

        long studentCount = studentRepository.countByBatchId(id);
        if (studentCount > 0) {
            throw new BadRequestException("Cannot delete batch '" + batch.getBatchName() +
                    "' because it currently has " + studentCount +
                    " registered student(s). Please reassign or delete these students before deleting the batch.");
        }

        batchRepository.delete(batch);
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        long totalBatches = batchRepository.count();
        long totalStudents = studentRepository.count();
        long totalCourses = batchRepository.countDistinctCourses();

        double average = 0.0;
        if (totalBatches > 0) {
            average = Math.round(((double) totalStudents / totalBatches) * 100.0) / 100.0;
        }

        return new DashboardStatsResponse(totalBatches, totalStudents, totalCourses, average);
    }

    private BatchResponse mapToResponse(Batch batch, long studentCount) {
        return new BatchResponse(
                batch.getId(),
                batch.getBatchName(),
                batch.getCourseName(),
                batch.getStartDate(),
                studentCount,
                batch.getCreatedAt()
        );
    }
}
