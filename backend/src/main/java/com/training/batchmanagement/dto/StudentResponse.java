package com.training.batchmanagement.dto;

import java.time.LocalDateTime;

public class StudentResponse {
    private Long id;
    private String studentName;
    private String rollNumber;
    private Long batchId;
    private String batchName;
    private String courseName;
    private LocalDateTime createdAt;

    public StudentResponse() {}

    public StudentResponse(Long id, String studentName, String rollNumber, Long batchId, String batchName, String courseName, LocalDateTime createdAt) {
        this.id = id;
        this.studentName = studentName;
        this.rollNumber = rollNumber;
        this.batchId = batchId;
        this.batchName = batchName;
        this.courseName = courseName;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public Long getBatchId() {
        return batchId;
    }

    public void setBatchId(Long batchId) {
        this.batchId = batchId;
    }

    public String getBatchName() {
        return batchName;
    }

    public void setBatchName(String batchName) {
        this.batchName = batchName;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
