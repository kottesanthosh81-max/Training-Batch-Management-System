import React, { useState } from 'react';
import { searchStudentsByRollNumber } from '../services/api';
import {
  Search,
  X,
  AlertCircle,
  Users,
  Layers,
  Edit2,
  Trash2,
  ArrowRight
} from 'lucide-react';

const SearchStudent = ({ onEditStudent, onDeleteStudent, onViewBatch }) => {
  const [rollNumber, setRollNumber] = useState('');
  const [searchedRoll, setSearchedRoll] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    const query = rollNumber.trim();
    if (!query) {
      setValidationError('Please enter a roll number to search.');
      return;
    }

    setValidationError('');
    setLoading(true);
    try {
      const response = await searchStudentsByRollNumber(query);
      setResults(response.data || []);
      setSearchedRoll(query);
    } catch (err) {
      setValidationError(err.message || 'Error occurred while searching.');
      setResults([]);
      setSearchedRoll(query);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setRollNumber('');
    setSearchedRoll('');
    setResults(null);
    setValidationError('');
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-title-group">
          <h2>Search Students by Roll Number</h2>
          <p>Query MySQL database across all training batches</p>
        </div>
      </div>

      <div className="search-bar-card">
        <form onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <div className="search-input-box">
              <Search size={18} className="search-icon-inside" />
              <input
                type="text"
                className={`form-control ${validationError ? 'is-invalid' : ''}`}
                placeholder="Enter student roll number (e.g. 23CS001)..."
                value={rollNumber}
                onChange={(e) => {
                  setRollNumber(e.target.value);
                  if (validationError) setValidationError('');
                }}
                autoFocus
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Search size={16} />
              {loading ? 'Searching...' : 'Search Database'}
            </button>

            {(rollNumber || results !== null) && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClear}
                title="Clear search"
              >
                <X size={16} />
                Clear
              </button>
            )}
          </div>
          {validationError && (
            <div className="invalid-feedback" style={{ marginTop: '0.5rem' }}>
              {validationError}
            </div>
          )}
        </form>
      </div>

      {/* Results Section */}
      {loading && (
        <div className="empty-state">
          <p>Searching database for roll number "{rollNumber}"...</p>
        </div>
      )}

      {!loading && results !== null && (
        <div>
          {results.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon-box">
                <AlertCircle size={28} />
              </div>
              <h3>No Students Found</h3>
              <p>
                No student record was found in the database with roll number <strong>"{searchedRoll}"</strong>.
              </p>
              <button className="btn btn-secondary" onClick={handleClear}>
                Try Another Search
              </button>
            </div>
          ) : (
            <div>
              <div style={{
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                color: '#065f46',
                padding: '0.85rem 1.25rem',
                borderRadius: '8px',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <strong>Found {results.length} record(s)</strong> matching roll number <code>"{searchedRoll}"</code>.
                  {results.length > 1 && (
                    <span style={{ display: 'block', fontSize: '0.825rem', color: '#047857' }}>
                      (The same roll number was registered across multiple distinct batches as allowed by the system design)
                    </span>
                  )}
                </div>
              </div>

              <div className="table-card">
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Student ID</th>
                        <th>Student Name</th>
                        <th>Roll Number</th>
                        <th>Batch Name</th>
                        <th>Course</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((student) => (
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
                                className="btn btn-secondary btn-sm"
                                onClick={() => onViewBatch(student.batchId)}
                                title="View Batch"
                              >
                                View Batch
                                <ArrowRight size={14} />
                              </button>
                              <button
                                className="btn btn-secondary btn-icon"
                                onClick={() => onEditStudent(student)}
                                title="Edit Student"
                              >
                                <Edit2 size={15} />
                              </button>
                              <button
                                className="btn btn-secondary btn-icon"
                                style={{ color: '#dc2626' }}
                                onClick={() => onDeleteStudent(student.id, student.studentName)}
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchStudent;
