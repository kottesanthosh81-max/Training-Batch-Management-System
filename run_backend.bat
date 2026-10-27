@echo off
title Training Batch Management - Backend (Port 8009 - Jetty)
echo ===================================================
echo  Starting Spring Boot Backend on Port 8009 (Jetty)
echo ===================================================
cd /d "%~dp0backend"
call mvnw.cmd spring-boot:run
pause
