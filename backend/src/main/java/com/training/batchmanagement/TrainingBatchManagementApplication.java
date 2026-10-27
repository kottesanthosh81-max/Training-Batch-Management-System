package com.training.batchmanagement;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class TrainingBatchManagementApplication {

    private static final Logger logger = LoggerFactory.getLogger(TrainingBatchManagementApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(TrainingBatchManagementApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onStartup() {
        logger.info("===============================================================");
        logger.info(" Training Batch Management System Backend is running!");
        logger.info(" Server Port   : 8009");
        logger.info(" Embedded Server: Jetty (Embedded Server active)");
        logger.info(" Database      : MySQL 8.x (training_batch_db)");
        logger.info(" Swagger / API : http://localhost:8009/api/batches");
        logger.info("===============================================================");
    }
}
