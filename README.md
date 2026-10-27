# Training Batch Management System
### Full-Stack Enterprise Application with Spring Boot, Embedded Jetty, MySQL 8, and React + Vite

A complete, production-ready Full-Stack Training Batch Management System built for managing professional training batches, student enrollments, course catalogs, and analytics.

---

## 1. System Architecture & Tech Stack

```
   ┌─────────────────────────────────────────────────────────────┐
   │                  React 18 + Vite (Port 5173)                │
   │      - DashboardCards, BatchList, StudentTable, etc.        │
   │      - Axios Client with Error Handling & Toasts            │
   └──────────────────────────────┬──────────────────────────────┘
                                  │ HTTP / REST (JSON)
                                  ▼
   ┌─────────────────────────────────────────────────────────────┐
   │         Spring Boot 3.4.x Backend (Port 8009)               │
   │  ┌───────────────────────────────────────────────────────┐  │
   │  │   Embedded Eclipse Jetty Server (Tomcat Excluded)     │  │
   │  └───────────────────────────────────────────────────────┘  │
   │   - Controllers: BatchController, StudentController         │
   │   - Services: BatchService, StudentService                  │
   │   - Repositories: BatchRepository, StudentRepository        │
   │   - DTOs & Custom GlobalExceptionHandler                    │
   └──────────────────────────────┬──────────────────────────────┘
                                  │ JPA / Hibernate ORM
                                  ▼
   ┌─────────────────────────────────────────────────────────────┐
   │                  MySQL 8.x (Port 3306)                      │
   │    Database: training_batch_db                              │
   │    - batches table (Primary Key, Auto-increment)            │
   │    - students table (Foreign Key, Composite Unique Index)   │
   └─────────────────────────────────────────────────────────────┘
```

### Technology Breakdown
- **Frontend**: React.js 18, Vite, JavaScript, JSX, CSS3, Axios, Lucide Icons
- **Backend**: Java 21, Spring Boot 3.4.x, Spring Web, Spring Data JPA, Hibernate, Jakarta Bean Validation, Maven
- **Embedded Web Server**: **Eclipse Jetty** (default Tomcat starter explicitly excluded)
- **Database**: MySQL 8.x (`training_batch_db`)
- **Deployment**:
  - Frontend: Vercel (`vercel.json` SPA routing)
  - Backend: Render (`backend/Dockerfile` multi-stage container)
  - Database: Managed MySQL / Aiven / PlanetScale / Render MySQL

---

## 2. Directory Structure

```
training-batch-management/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── DashboardCards.jsx
│   │   │   ├── BatchForm.jsx
│   │   │   ├── StudentForm.jsx
│   │   │   ├── BatchList.jsx
│   │   │   ├── StudentTable.jsx
│   │   │   └── SearchStudent.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json
│   └── index.html
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── training/
│   │   │   │           └── batchmanagement/
│   │   │   │               ├── TrainingBatchManagementApplication.java
│   │   │   │               ├── config/
│   │   │   │               │   └── CorsConfig.java
│   │   │   │               ├── controller/
│   │   │   │               │   ├── BatchController.java
│   │   │   │               │   └── StudentController.java
│   │   │   │               ├── entity/
│   │   │   │               │   ├── Batch.java
│   │   │   │               │   └── Student.java
│   │   │   │               ├── repository/
│   │   │   │               │   ├── BatchRepository.java
│   │   │   │               │   └── StudentRepository.java
│   │   │   │               ├── service/
│   │   │   │               │   ├── BatchService.java
│   │   │   │               │   └── StudentService.java
│   │   │   │               ├── dto/
│   │   │   │               │   ├── BatchRequest.java
│   │   │   │               │   ├── BatchResponse.java
│   │   │   │               │   ├── StudentRequest.java
│   │   │   │               │   ├── StudentResponse.java
│   │   │   │               │   ├── DashboardStatsResponse.java
│   │   │   │               │   └── ApiResponse.java
│   │   │   │               └── exception/
│   │   │   │                   ├── GlobalExceptionHandler.java
│   │   │   │                   ├── ResourceNotFoundException.java
│   │   │   │                   └── BadRequestException.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── .env.example
│   ├── pom.xml
│   ├── mvnw.cmd
│   ├── mvnw
│   └── Dockerfile
│
├── database/
│   └── schema.sql
│
├── .gitignore
└── README.md
```

---

## 3. Database Design & Relational Constraints

### Table: `batches`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `BIGINT` | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for batch |
| `batch_name` | `VARCHAR(150)` | NOT NULL | Name of the batch (e.g. Java Full Stack Batch A) |
| `course_name` | `VARCHAR(150)` | NOT NULL | Course topic (e.g. Java Full Stack Development) |
| `start_date` | `DATE` | NOT NULL | Scheduled start date |
| `created_at` | `TIMESTAMP` | DEFAULT CURRENT_TIMESTAMP | Audit timestamp |

### Table: `students`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `BIGINT` | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for student |
| `student_name` | `VARCHAR(150)` | NOT NULL | Student's full name |
| `roll_number` | `VARCHAR(50)` | NOT NULL | Roll number / ID card code |
| `batch_id` | `BIGINT` | FOREIGN KEY REFERENCES `batches(id)` | Batch relation |
| `created_at` | `TIMESTAMP` | DEFAULT CURRENT_TIMESTAMP | Registration timestamp |

### Composite Unique Key
```sql
CONSTRAINT uk_batch_roll UNIQUE (batch_id, roll_number)
```
- **Constraint Rule**: A roll number must be unique *within* any given batch.
- **Cross-batch Flexibility**: The same roll number (e.g. `23CS001`) may be enrolled in a different batch (e.g. `Cloud DevOps Batch Nov`).

---

## 4. REST API Documentation

### Batches (`/api/batches`)
| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| `GET` | `/api/batches` | List all batches with student counts | None | `ApiResponse<List<BatchResponse>>` |
| `GET` | `/api/batches/{id}` | Get single batch details | None | `ApiResponse<BatchResponse>` |
| `POST` | `/api/batches` | Create a new batch | `BatchRequest` (JSON) | `ApiResponse<BatchResponse>` |
| `PUT` | `/api/batches/{id}` | Update existing batch | `BatchRequest` (JSON) | `ApiResponse<BatchResponse>` |
| `DELETE` | `/api/batches/{id}` | Delete batch (blocked if students exist) | None | `ApiResponse<Void>` |
| `GET` | `/api/batches/{id}/students` | Get all students in a batch | None | `ApiResponse<List<StudentResponse>>` |
| `GET` | `/api/batches/dashboard-stats`| Total batches, students, courses, avg | None | `ApiResponse<DashboardStatsResponse>` |

### Students (`/api/students`)
| Method | Endpoint | Description | Request Body / Param | Response |
|---|---|---|---|---|
| `GET` | `/api/students` | List all students across batches | None | `ApiResponse<List<StudentResponse>>` |
| `GET` | `/api/students/{id}` | Get student by ID | None | `ApiResponse<StudentResponse>` |
| `POST` | `/api/students` | Register student (validates uniqueness) | `StudentRequest` (JSON) | `ApiResponse<StudentResponse>` |
| `PUT` | `/api/students/{id}` | Update student or reassign batch | `StudentRequest` (JSON) | `ApiResponse<StudentResponse>` |
| `DELETE` | `/api/students/{id}` | Delete a student | None | `ApiResponse<Void>` |
| `GET` | `/api/students/search` | Search students by roll number | `?rollNumber=23CS001` | `ApiResponse<List<StudentResponse>>` |

---

## 5. Local Setup & Execution Guide

### Prerequisites
- Java JDK 21+ (`java -version`)
- Node.js 18+ and npm (`node -v`)
- MySQL 8.x running on port 3306

### Step 1: Database Setup
Execute the SQL script in MySQL:
```bash
mysql -u root -p < database/schema.sql
```
*(Or in MySQL Workbench, open `database/schema.sql` and click Execute).*

### Step 2: Run the Spring Boot Backend (Port 8009 with Jetty)
```bash
cd backend
./mvnw.cmd spring-boot:run
```
On startup, you will observe the log:
```
[INFO] org.eclipse.jetty.server.Server: Started Server@...
[INFO] Embedded Server: Jetty (Embedded Server active)
[INFO] Server Port   : 8009
```

### Step 3: Run the React Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 6. Cloud Deployment Instructions

### A. Deploy Backend to Render
1. Push this repository to GitHub.
2. In Render, select **New Web Service** and link your repo.
3. Choose **Docker** as the environment (Render will automatically detect `backend/Dockerfile`).
4. Set the Root Directory to `backend`.
5. Add Environment Variables:
   - `SERVER_PORT`: `8009`
   - `DB_URL`: `jdbc:mysql://<your_cloud_mysql_host>:3306/training_batch_db?useSSL=true&allowPublicKeyRetrieval=true`
   - `DB_USERNAME`: `<cloud_db_user>`
   - `DB_PASSWORD`: `<cloud_db_password>`
6. Click **Deploy Web Service**.

### B. Deploy Frontend to Vercel
1. In Vercel, click **Add New Project** and import the GitHub repository.
2. Set the Root Directory to `frontend`.
3. Framework Preset: **Vite**.
4. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://your-backend.onrender.com`
5. Click **Deploy**.

---

## 7. College Full Stack Lab Viva Questions & Answers

### Q1: Why did we use Jetty instead of Tomcat? How is it configured in Spring Boot?
**Answer:**
Spring Boot by default packages Apache Tomcat via `spring-boot-starter-tomcat`. In this project, we explicitly excluded `spring-boot-starter-tomcat` from `spring-boot-starter-web` and added `spring-boot-starter-jetty`.
Jetty is lightweight, has a smaller memory footprint, initializes quickly, and is well-known for handling asynchronous, high-concurrency event-driven workloads.

### Q2: How does the application prevent infinite JSON recursion between Batch and Student?
**Answer:**
In bidirectional JPA relationships (`@OneToMany` in `Batch` and `@ManyToOne` in `Student`), returning raw entity objects in REST controllers leads to Jackson serialization loops (`Batch -> Student -> Batch -> ...`).
We prevent this using two architectural best practices:
1. Using **Data Transfer Objects (DTOs)** (`BatchResponse`, `StudentResponse`) that decouple database entities from HTTP responses.
2. Annotating the relationship with `@JsonIgnore` and using `FetchType.LAZY`.

### Q3: How is the composite unique constraint enforced in MySQL and Spring Boot?
**Answer:**
In MySQL, we defined `CONSTRAINT uk_batch_roll UNIQUE (batch_id, roll_number)`.
In Spring Boot:
1. `Student` entity specifies `@UniqueConstraint(name = "uk_batch_roll", columnNames = {"batch_id", "roll_number"})`.
2. The `StudentService` proactively queries `studentRepository.existsByBatchIdAndRollNumberIgnoreCase(...)` before persisting, throwing a readable `BadRequestException` if a duplicate exists.
3. If a race condition bypasses service checks, `GlobalExceptionHandler` intercepts the database `DataIntegrityViolationException` and converts it into a friendly HTTP 400 response.

### Q4: How does Batch deletion integrity work?
**Answer:**
Before deleting a batch, `BatchService.deleteBatch(id)` checks `studentRepository.countByBatchId(id)`. If count > 0, deletion is blocked with a 400 Bad Request error prompting the user to remove or reassign the students first, preventing accidental orphan records.
