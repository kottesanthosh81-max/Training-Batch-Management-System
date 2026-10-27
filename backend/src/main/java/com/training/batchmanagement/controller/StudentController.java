package com.training.batchmanagement.controller;

import com.training.batchmanagement.dto.ApiResponse;
import com.training.batchmanagement.dto.StudentRequest;
import com.training.batchmanagement.dto.StudentResponse;
import com.training.batchmanagement.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StudentResponse>> registerStudent(@Valid @RequestBody StudentRequest request) {
        StudentResponse student = studentService.registerStudent(request);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Student registered successfully!", student),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StudentResponse>>> getAllStudents() {
        List<StudentResponse> students = studentService.getAllStudents();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Students retrieved successfully", students)
        );
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<StudentResponse>>> searchStudents(
            @RequestParam("rollNumber") String rollNumber) {
        List<StudentResponse> results = studentService.searchStudentsByRollNumber(rollNumber);
        String msg = results.isEmpty()
                ? "No student found with roll number: " + rollNumber
                : "Found " + results.size() + " student(s) matching roll number: " + rollNumber;
        return ResponseEntity.ok(
                new ApiResponse<>(true, msg, results)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentResponse>> getStudentById(@PathVariable Long id) {
        StudentResponse student = studentService.getStudentById(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Student retrieved successfully", student)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentResponse>> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentRequest request) {
        StudentResponse updated = studentService.updateStudent(id, request);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Student details updated successfully!", updated)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Student deleted successfully!")
        );
    }
}
