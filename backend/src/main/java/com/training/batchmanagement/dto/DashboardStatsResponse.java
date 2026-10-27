package com.training.batchmanagement.dto;

public class DashboardStatsResponse {
    private long totalBatches;
    private long totalStudents;
    private long totalCourses;
    private double averageStudentsPerBatch;

    public DashboardStatsResponse() {}

    public DashboardStatsResponse(long totalBatches, long totalStudents, long totalCourses, double averageStudentsPerBatch) {
        this.totalBatches = totalBatches;
        this.totalStudents = totalStudents;
        this.totalCourses = totalCourses;
        this.averageStudentsPerBatch = averageStudentsPerBatch;
    }

    public long getTotalBatches() {
        return totalBatches;
    }

    public void setTotalBatches(long totalBatches) {
        this.totalBatches = totalBatches;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalCourses() {
        return totalCourses;
    }

    public void setTotalCourses(long totalCourses) {
        this.totalCourses = totalCourses;
    }

    public double getAverageStudentsPerBatch() {
        return averageStudentsPerBatch;
    }

    public void setAverageStudentsPerBatch(double averageStudentsPerBatch) {
        this.averageStudentsPerBatch = averageStudentsPerBatch;
    }
}
