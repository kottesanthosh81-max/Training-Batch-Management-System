import React, { useState } from 'react';
import {
  ArrowLeft,
  UserPlus,
  Users,
  Edit2,
  Trash2,
  AlertTriangle,
  Layers
} from 'lucide-react';

const StudentTable = ({
  students,
  selectedBatch,
  loading,
  onBackToBatches,
  onAddStudentToBatch,
  onEditStudent,
  onDeleteStudent
}) => {
  const [studentToDelete, setStudentToDelete] = useState(null);

  const confirmDelete = () => {
    if (studentToDelete) {
      onDeleteStudent(studentToDelete.id, studentToDelete.studentName);
      setStudentToDelete(null);
    }
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-title-group">
          {selectedBatch ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="batch-badge">Batch #{selectedBatch.id}</span>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>• {selectedBatch.courseName}</span>
              </div>
              <h2>Students in {selectedBatch.batchName}</h2>
              <p>Showing registered students assigned to this specific batch</p>
            </div>
          ) : (
            <div>
              <h2>All Registered Students</h2>
              <p>Directory of all students enrolled across all training batches</p>
            </div>
          )}
        </div>

        <div className="section-actions">
          {selectedBatch && (
            <button className="btn btn-secondary" onClick={onBackToBatches}>
              <ArrowLeft size={16} />
              Back to Batches
            </button>
          )}

          <button
            className="btn btn-primary"
            onClick={() => onAddStudentToBatch(selectedBatch ? selectedBatch.id : null)}
          >
            <UserPlus size={16} />
            {selectedBatch ? 'Add Student to this Batch' : 'Register New Student'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <p>Loading students from database...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-box">
            <Users size={28} />
          </div>
          <h3>No Students Registered</h3>
          <p>
            {selectedBatch
              ? `There are currently no students registered in batch "${selectedBatch.batchName}". Add students to populate this batch.`
              : 'No students have been registered in any batch yet.'}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => onAddStudentToBatch(selectedBatch ? selectedBatch.id : null)}
          >
            <UserPlus size={16} />
            Register Student Now
          </button>
        </div>
      ) : (
        <div className="table-card">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Roll Number</th>
                  <th>Assigned Batch</th>
                  <th>Course</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td style={{ fontWeight: 600, color: '#64748b' }}>
                      #{student.id}
                    </td>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>
                      {student.studentName}
                    </td>
                    <td>
                      <span className="roll-badge">{student.rollNumber}</span>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
                        <Layers size={14} color="#4338ca" />
                        {student.batchName}
                      </span>
                    </td>
                    <td style={{ color: '#64748b' }}>
                      {student.courseName}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          className="btn btn-secondary btn-icon"
                          onClick={() => onEditStudent(student)}
                          title="Edit Student or Reassign Batch"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          className="btn btn-secondary btn-icon"
                          style={{ color: '#dc2626' }}
                          onClick={() => setStudentToDelete(student)}
                          title="Delete Student"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {studentToDelete && (
        <div className="modal-overlay" onClick={() => setStudentToDelete(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={20} />
                Confirm Student Deletion
              </h3>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.925rem' }}>
                Are you sure you want to delete student <strong>"{studentToDelete.studentName}"</strong> (Roll: {studentToDelete.rollNumber})?
              </p>
              <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                This student will be permanently removed from the database and batch statistics will update.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setStudentToDelete(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                <Trash2 size={16} />
                Yes, Delete Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTable;
