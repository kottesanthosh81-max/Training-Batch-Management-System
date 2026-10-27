import React, { useState } from 'react';
import {
  Users,
  Calendar,
  BookOpen,
  Eye,
  Edit2,
  Trash2,
  Search,
  Plus,
  AlertTriangle
} from 'lucide-react';

const BatchList = ({
  batches,
  loading,
  onViewStudents,
  onEditBatch,
  onDeleteBatch,
  onAddNewBatch
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [batchToDelete, setBatchToDelete] = useState(null);

  const filteredBatches = batches.filter((b) => {
    const term = searchTerm.toLowerCase();
    return (
      b.batchName.toLowerCase().includes(term) ||
      b.courseName.toLowerCase().includes(term) ||
      String(b.id).includes(term)
    );
  });

  const confirmDelete = () => {
    if (batchToDelete) {
      onDeleteBatch(batchToDelete.id, batchToDelete.batchName, batchToDelete.studentCount);
      setBatchToDelete(null);
    }
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-title-group">
          <h2>Training Batches</h2>
          <p>Manage courses, batches, and monitor real-time student enrollments</p>
        </div>
        <div className="section-actions">
          <button className="btn btn-primary" onClick={onAddNewBatch}>
            <Plus size={16} />
            Create Batch
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="search-bar-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div className="search-input-wrapper">
          <div className="search-input-box" style={{ width: '100%' }}>
            <Search size={18} className="search-icon-inside" />
            <input
              type="text"
              className="form-control"
              placeholder="Search batches by name or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <p>Loading batches from database...</p>
        </div>
      ) : filteredBatches.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-box">
            <BookOpen size={28} />
          </div>
          <h3>No Batches Found</h3>
          <p>
            {searchTerm
              ? `No training batch matches "${searchTerm}". Try a different search.`
              : 'No batches have been created yet. Create your first batch to start registering students.'}
          </p>
          <button className="btn btn-primary" onClick={onAddNewBatch}>
            <Plus size={16} />
            Create First Batch
          </button>
        </div>
      ) : (
        <div className="cards-grid">
          {filteredBatches.map((batch) => (
            <div key={batch.id} className="batch-card">
              <div className="batch-card-header">
                <span className="batch-badge">Batch #{batch.id}</span>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    color: batch.studentCount > 0 ? '#059669' : '#64748b',
                    background: batch.studentCount > 0 ? '#d1fae5' : '#f1f5f9',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <Users size={14} />
                  {batch.studentCount} {batch.studentCount === 1 ? 'Student' : 'Students'}
                </span>
              </div>

              <div className="batch-card-body">
                <h3 className="batch-title">{batch.batchName}</h3>
                <div className="course-badge">{batch.courseName}</div>

                <div className="batch-meta">
                  <div className="meta-row">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={15} /> Start Date:
                    </span>
                    <span className="meta-val">{batch.startDate}</span>
                  </div>
                </div>
              </div>

              <div className="batch-card-footer">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onViewStudents(batch)}
                  title="View registered students for this batch"
                >
                  <Eye size={15} />
                  View Students
                </button>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    className="btn btn-secondary btn-icon"
                    onClick={() => onEditBatch(batch)}
                    title="Edit Batch"
                  >
                    <Edit2 size={15} />
                  </button>

                  <button
                    className="btn btn-secondary btn-icon"
                    style={{ color: '#dc2626' }}
                    onClick={() => setBatchToDelete(batch)}
                    title="Delete Batch"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {batchToDelete && (
        <div className="modal-overlay" onClick={() => setBatchToDelete(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={20} />
                Confirm Batch Deletion
              </h3>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom: '1rem', fontSize: '0.925rem' }}>
                Are you sure you want to delete batch <strong>"{batchToDelete.batchName}"</strong>?
              </p>
              {batchToDelete.studentCount > 0 ? (
                <div style={{
                  background: '#fef3c7',
                  border: '1px solid #fcd34d',
                  color: '#92400e',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem'
                }}>
                  ⚠️ <strong>Notice:</strong> This batch currently contains <strong>{batchToDelete.studentCount}</strong> registered student(s). Per data integrity rules, the system will prevent deletion until students are reassigned or removed.
                </div>
              ) : (
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                  This batch contains 0 students and can be safely removed.
                </p>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setBatchToDelete(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                <Trash2 size={16} />
                Yes, Delete Batch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchList;
