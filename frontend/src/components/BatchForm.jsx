import React, { useState, useEffect } from 'react';
import { createBatch, updateBatch } from '../services/api';
import { X, Save, AlertCircle } from 'lucide-react';

const BatchForm = ({ batchToEdit, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    batchName: '',
    courseName: '',
    startDate: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const isEditMode = Boolean(batchToEdit && batchToEdit.id);

  useEffect(() => {
    if (batchToEdit) {
      setFormData({
        batchName: batchToEdit.batchName || '',
        courseName: batchToEdit.courseName || '',
        startDate: batchToEdit.startDate || '',
      });
    } else {
      setFormData({
        batchName: '',
        courseName: '',
        startDate: '',
      });
    }
    setErrors({});
    setServerError('');
  }, [batchToEdit]);

  const validate = () => {
    const errs = {};
    if (!formData.batchName.trim()) {
      errs.batchName = 'Batch name is required.';
    } else if (formData.batchName.trim().length > 150) {
      errs.batchName = 'Batch name cannot exceed 150 characters.';
    }

    if (!formData.courseName.trim()) {
      errs.courseName = 'Course name is required.';
    } else if (formData.courseName.trim().length > 150) {
      errs.courseName = 'Course name cannot exceed 150 characters.';
    }

    if (!formData.startDate) {
      errs.startDate = 'Start date is required.';
    } else {
      // Validate proper date format
      const dateObj = new Date(formData.startDate);
      if (isNaN(dateObj.getTime())) {
        errs.startDate = 'Please enter a valid calendar date.';
      }
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
        batchName: formData.batchName.trim(),
        courseName: formData.courseName.trim(),
        startDate: formData.startDate,
      };

      if (isEditMode) {
        await updateBatch(batchToEdit.id, payload);
        onSuccess(`Batch "${payload.batchName}" updated successfully!`);
      } else {
        await createBatch(payload);
        onSuccess(`Batch "${payload.batchName}" created successfully!`);
      }
      onClose();
    } catch (err) {
      setServerError(err.message || 'Failed to save batch. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {isEditMode ? 'Edit Training Batch' : 'Create New Training Batch'}
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
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem'
              }}>
                <AlertCircle size={18} />
                <span>{serverError}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="batchName">
                Batch Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="batchName"
                name="batchName"
                className={`form-control ${errors.batchName ? 'is-invalid' : ''}`}
                placeholder="e.g. Java Full Stack Batch A"
                value={formData.batchName}
                onChange={handleChange}
                autoFocus
              />
              {errors.batchName && (
                <div className="invalid-feedback">{errors.batchName}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="courseName">
                Course Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="courseName"
                name="courseName"
                className={`form-control ${errors.courseName ? 'is-invalid' : ''}`}
                placeholder="e.g. Java Full Stack Development"
                value={formData.courseName}
                onChange={handleChange}
              />
              {errors.courseName && (
                <div className="invalid-feedback">{errors.courseName}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="startDate">
                Start Date <span className="required">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
                value={formData.startDate}
                onChange={handleChange}
              />
              {errors.startDate && (
                <div className="invalid-feedback">{errors.startDate}</div>
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
              <Save size={16} />
              {submitting ? 'Saving...' : isEditMode ? 'Update Batch' : 'Create Batch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BatchForm;
