import React, { useState, useEffect } from 'react';
import { registerStudent, updateStudent } from '../services/api';
import { X, Save, AlertCircle, UserCheck } from 'lucide-react';

const StudentForm = ({ studentToEdit, batches, initialBatchId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    rollNumber: '',
    batchId: initialBatchId || '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const isEditMode = Boolean(studentToEdit && studentToEdit.id);

  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        studentName: studentToEdit.studentName || '',
        rollNumber: studentToEdit.rollNumber || '',
        batchId: studentToEdit.batchId || '',
      });
    } else {
      setFormData({
        studentName: '',
        rollNumber: '',
        batchId: initialBatchId || (batches.length > 0 ? batches[0].id : ''),
      });
    }
    setErrors({});
    setServerError('');
  }, [studentToEdit, initialBatchId, batches]);

  const validate = () => {
    const errs = {};
    if (!formData.studentName.trim()) {
      errs.studentName = 'Student name is required.';
    } else if (formData.studentName.trim().length > 150) {
      errs.studentName = 'Student name cannot exceed 150 characters.';
    }

    if (!formData.rollNumber.trim()) {
      errs.rollNumber = 'Roll number is required.';
    } else if (formData.rollNumber.trim().length > 50) {
      errs.rollNumber = 'Roll number cannot exceed 50 characters.';
    }

    if (!formData.batchId) {
      errs.batchId = 'Please select a training batch.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError('');

    try {
      const payload = {
        studentName: formData.studentName.trim(),
        rollNumber: formData.rollNumber.trim(),
        batchId: Number(formData.batchId),
      };

      if (isEditMode) {
        await updateStudent(studentToEdit.id, payload);
        onSuccess(`Student "${payload.studentName}" updated successfully!`);
      } else {
        await registerStudent(payload);
        onSuccess(`Student "${payload.studentName}" (${payload.rollNumber}) registered successfully!`);
      }
      onClose();
    } catch (err) {
      setServerError(err.message || 'Failed to register student.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {isEditMode ? 'Edit Student Details' : 'Register New Student'}
          </h3>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {serverError && (
              <div style={{
                background: '#fee2e2',
                border: '1px solid #f87171',
                color: '#991b1b',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                fontSize: '0.85rem'
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{serverError}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="studentName">
                Student Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="studentName"
                name="studentName"
                className={`form-control ${errors.studentName ? 'is-invalid' : ''}`}
                placeholder="e.g. Rahul Kumar"
                value={formData.studentName}
                onChange={handleChange}
                autoFocus
              />
              {errors.studentName && (
                <div className="invalid-feedback">{errors.studentName}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="rollNumber">
                Roll Number <span className="required">*</span>
              </label>
              <input
                type="text"
                id="rollNumber"
                name="rollNumber"
                className={`form-control ${errors.rollNumber ? 'is-invalid' : ''}`}
                placeholder="e.g. 23CS001"
                value={formData.rollNumber}
                onChange={handleChange}
              />
              <small style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                Note: Must be unique within the selected batch. The same roll number can exist across different batches.
              </small>
              {errors.rollNumber && (
                <div className="invalid-feedback">{errors.rollNumber}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="batchId">
                Select Training Batch <span className="required">*</span>
              </label>
              <select
                id="batchId"
                name="batchId"
                className={`form-control ${errors.batchId ? 'is-invalid' : ''}`}
                value={formData.batchId}
                onChange={handleChange}
              >
                <option value="">-- Choose a Batch --</option>
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.batchName} ({b.courseName})
                  </option>
                ))}
              </select>
              {errors.batchId && (
                <div className="invalid-feedback">{errors.batchId}</div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              <UserCheck size={16} />
              {submitting ? 'Saving...' : isEditMode ? 'Update Student' : 'Register Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
