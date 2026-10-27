package com.training.batchmanagement.service;

import com.training.batchmanagement.dto.StudentRequest;
import com.training.batchmanagement.dto.StudentResponse;
import com.training.batchmanagement.entity.Batch;
import com.training.batchmanagement.entity.Student;
import com.training.batchmanagement.exception.BadRequestException;
import com.training.batchmanagement.exception.ResourceNotFoundException;
import com.training.batchmanagement.repository.BatchRepository;
import com.training.batchmanagement.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class StudentService {

    private final StudentRepository studentRepository;
    private final BatchRepository batchRepository;

    public StudentService(StudentRepository studentRepository, BatchRepository batchRepository) {
        this.studentRepository = studentRepository;
        this.batchRepository = batchRepository;
    }

    public StudentResponse registerStudent(StudentRequest request) {
        Batch batch = batchRepository.findById(request.getBatchId())
                .orElseThrow(() -> new ResourceNotFoundException("Selected batch not found with ID: " + request.getBatchId()));

        String trimmedRoll = request.getRollNumber().trim();

        // Check if student with this roll number already exists in this batch
        if (studentRepository.existsByBatchIdAndRollNumberIgnoreCase(batch.getId(), trimmedRoll)) {
            throw new BadRequestException("Roll number '" + trimmedRoll + "' is already registered in batch '" +
                    batch.getBatchName() + "'. Roll numbers must be unique within a batch.");
        }

        Student student = new Student();
        student.setStudentName(request.getStudentName().trim());
        student.setRollNumber(trimmedRoll);
        student.setBatch(batch);

        Student savedStudent = studentRepository.save(student);
        return mapToResponse(savedStudent);
    }

    @Transactional(readOnly = true)
    public List<StudentResponse> getAllStudents() {
        return studentRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StudentResponse getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        return mapToResponse(student);
    }

    @Transactional(readOnly = true)
    public List<StudentResponse> getStudentsByBatchId(Long batchId) {
        if (!batchRepository.existsById(batchId)) {
            throw new ResourceNotFoundException("Batch not found with ID: " + batchId);
        }
        return studentRepository.findByBatchIdOrderByCreatedAtDesc(batchId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StudentResponse> searchStudentsByRollNumber(String rollNumber) {
        if (rollNumber == null || rollNumber.trim().isEmpty()) {
            throw new BadRequestException("Search query cannot be empty. Please enter a roll number to search.");
        }
        return studentRepository.findByRollNumberIgnoreCase(rollNumber.trim())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public StudentResponse updateStudent(Long id, StudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        Batch targetBatch = batchRepository.findById(request.getBatchId())
                .orElseThrow(() -> new ResourceNotFoundException("Target batch not found with ID: " + request.getBatchId()));

        String newRoll = request.getRollNumber().trim();

        // Check if destination batch already has this roll number belonging to a DIFFERENT student
        Optional<Student> existingWithRoll = studentRepository.findByBatchIdAndRollNumberIgnoreCase(targetBatch.getId(), newRoll);
        if (existingWithRoll.isPresent() && !existingWithRoll.get().getId().equals(student.getId())) {
            throw new BadRequestException("Roll number '" + newRoll + "' is already in use in batch '" +
                    targetBatch.getBatchName() + "'. Please choose another roll number or assign to a different batch.");
        }

        student.setStudentName(request.getStudentName().trim());
        student.setRollNumber(newRoll);
        student.setBatch(targetBatch);

        Student updatedStudent = studentRepository.save(student);
        return mapToResponse(updatedStudent);
    }

    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        studentRepository.delete(student);
    }

    private StudentResponse mapToResponse(Student student) {
        return new StudentResponse(
                student.getId(),
                student.getStudentName(),
                student.getRollNumber(),
                student.getBatch().getId(),
                student.getBatch().getBatchName(),
                student.getBatch().getCourseName(),
                student.getCreatedAt()
        );
    }
}
