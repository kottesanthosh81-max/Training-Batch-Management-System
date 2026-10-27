package com.training.batchmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class BatchRequest {

    @NotBlank(message = "Batch name is required")
    @Size(max = 150, message = "Batch name must not exceed 150 characters")
    private String batchName;

    @NotBlank(message = "Course name is required")
    @Size(max = 150, message = "Course name must not exceed 150 characters")
    private String courseName;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    public BatchRequest() {}

    public BatchRequest(String batchName, String courseName, LocalDate startDate) {
        this.batchName = batchName;
        this.courseName = courseName;
        this.startDate = startDate;
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
}
