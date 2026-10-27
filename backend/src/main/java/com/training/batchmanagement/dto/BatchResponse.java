package com.training.batchmanagement.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class BatchResponse {
    private Long id;
    private String batchName;
    private String courseName;
    private LocalDate startDate;
    private long studentCount;
    private LocalDateTime createdAt;

    public BatchResponse() {}

    public BatchResponse(Long id, String batchName, String courseName, LocalDate startDate, long studentCount, LocalDateTime createdAt) {
        this.id = id;
        this.batchName = batchName;
        this.courseName = courseName;
        this.startDate = startDate;
        this.studentCount = studentCount;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public long getStudentCount() {
        return studentCount;
    }

    public void setStudentCount(long studentCount) {
        this.studentCount = studentCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
