import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import DashboardCards from './components/DashboardCards';
import BatchList from './components/BatchList';
import StudentTable from './components/StudentTable';
import SearchStudent from './components/SearchStudent';
import BatchForm from './components/BatchForm';
import StudentForm from './components/StudentForm';
import {
  getBatches,
  getAllStudents,
  getStudentsByBatch,
  getDashboardStats,
  deleteBatch,
  deleteStudent
} from './services/api';
import {
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Plus,
  Layers,
  Users,
  Search,
  BookOpen
} from 'lucide-react';

function App() {
  // Navigation & View State
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedBatch, setSelectedBatch] = useState(null);

  // Data State
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [batchToEdit, setBatchToEdit] = useState(null);

  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [initialBatchIdForStudent, setInitialBatchIdForStudent] = useState(null);

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (type, title, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch Dashboard Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await getDashboardStats();
      setDashboardStats(res.data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }, []);

  // Fetch Batches
  const fetchBatches = useCallback(async () => {
    try {
      const res = await getBatches();
      setBatches(res.data || []);
    } catch (err) {
      console.error('Failed to load batches:', err);
      addToast('error', 'Error', 'Failed to fetch batches from server.');
    }
  }, []);

  // Fetch Students (either for selected batch or all)
  const fetchStudents = useCallback(async () => {
    try {
      if (selectedBatch) {
        const res = await getStudentsByBatch(selectedBatch.id);
        setStudents(res.data || []);
      } else {
        const res = await getAllStudents();
        setStudents(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
      addToast('error', 'Error', 'Failed to fetch students from server.');
    }
  }, [selectedBatch]);

  // Initial Load
  const refreshAllData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchBatches(), fetchStudents()]);
    setLoading(false);
  }, [fetchStats, fetchBatches, fetchStudents]);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Navigation Handlers
  const handleViewStudents = (batch) => {
    setSelectedBatch(batch);
    setActiveView('batch-students');
  };

  const handleBackToBatches = () => {
    setSelectedBatch(null);
    setActiveView('batches');
  };

  const handleViewBatchFromSearch = (batchId) => {
    const found = batches.find((b) => b.id === batchId);
    if (found) {
      setSelectedBatch(found);
      setActiveView('batch-students');
    } else {
      setActiveView('batches');
    }
  };

  // Batch Form Handlers
  const handleOpenNewBatch = () => {
    setBatchToEdit(null);
    setBatchModalOpen(true);
  };

  const handleEditBatch = (batch) => {
    setBatchToEdit(batch);
    setBatchModalOpen(true);
  };

  const handleBatchSuccess = (message) => {
    addToast('success', 'Success', message);
    refreshAllData();
  };

  const handleDeleteBatch = async (id, batchName, studentCount) => {
    try {
      await deleteBatch(id);
      addToast('success', 'Batch Deleted', `Batch "${batchName}" has been removed.`);
      refreshAllData();
    } catch (err) {
      addToast('error', 'Cannot Delete Batch', err.message);
    }
  };

  // Student Form Handlers
  const handleOpenNewStudent = (preselectedBatchId = null) => {
    setStudentToEdit(null);
    setInitialBatchIdForStudent(preselectedBatchId);
    setStudentModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setStudentToEdit(student);
    setStudentModalOpen(true);
  };

  const handleStudentSuccess = (message) => {
    addToast('success', 'Success', message);
    refreshAllData();
  };

  const handleDeleteStudent = async (id, studentName) => {
    try {
      await deleteStudent(id);
      addToast('success', 'Student Deleted', `Student "${studentName}" removed.`);
      refreshAllData();
    } catch (err) {
      addToast('error', 'Deletion Error', err.message);
    }
  };

  return (
    <div className="app-container">
      {/* Toast Alert System */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.type === 'success' && <CheckCircle size={20} color="#059669" />}
            {toast.type === 'error' && <AlertCircle size={20} color="#dc2626" />}
            {toast.type === 'info' && <Info size={20} color="#0284c7" />}
            <div className="toast-content">
              <div className="toast-title">{toast.title}</div>
              <div className="toast-message">{toast.message}</div>
            </div>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Main Top Navigation */}
      <Navbar
        activeView={activeView}
        setActiveView={(view) => {
          if (view === 'all-students') {
            setSelectedBatch(null);
          }
          setActiveView(view);
        }}
        onOpenNewBatch={handleOpenNewBatch}
        onOpenNewStudent={() => handleOpenNewStudent()}
      />

      <main className="main-content">
        {/* Viva / Examination Architecture Pill */}
        <div className="viva-banner">
          <div>
            <span className="viva-badge">Full Stack Lab Exam Project</span>
            <span className="viva-info" style={{ marginLeft: '0.75rem' }}>
              React (Port 5173) + Spring Boot 3.4.x with <strong>Embedded Jetty</strong> (Port 8009) + MySQL 8.x
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4338ca', background: '#e0e7ff', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
              Tomcat Excluded
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#047857', background: '#d1fae5', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
              Jetty Active
            </span>
          </div>
        </div>

        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <div>
            <div className="section-header">
              <div className="section-title-group">
                <h2>System Overview & Analytics</h2>
                <p>Real-time statistics calculated directly from MySQL database</p>
              </div>
              <div className="section-actions">
                <button className="btn btn-secondary" onClick={handleOpenNewBatch}>
                  <Plus size={16} />
                  New Batch
                </button>
                <button className="btn btn-primary" onClick={() => handleOpenNewStudent()}>
                  <Plus size={16} />
                  Add Student
                </button>
              </div>
            </div>

            {/* Top Metric Cards */}
            <DashboardCards
              stats={dashboardStats}
              loading={loading}
              onCardClick={(targetView) => {
                if (targetView === 'all-students') setSelectedBatch(null);
                setActiveView(targetView);
              }}
            />

            {/* Quick Actions & Recent Batches */}
            <div style={{ marginTop: '2rem' }}>
              <div className="section-header" style={{ marginBottom: '1rem' }}>
                <div className="section-title-group">
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Active Batches</h3>
                  <p>Browse current training batches and quick actions</p>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveView('batches')}
                >
                  View All Batches →
                </button>
              </div>

              <BatchList
                batches={batches.slice(0, 6)}
                loading={loading}
                onViewStudents={handleViewStudents}
                onEditBatch={handleEditBatch}
                onDeleteBatch={handleDeleteBatch}
                onAddNewBatch={handleOpenNewBatch}
              />
            </div>
          </div>
        )}

        {/* Batches View */}
        {activeView === 'batches' && (
          <BatchList
            batches={batches}
            loading={loading}
            onViewStudents={handleViewStudents}
            onEditBatch={handleEditBatch}
            onDeleteBatch={handleDeleteBatch}
            onAddNewBatch={handleOpenNewBatch}
          />
        )}

        {/* Batch Students View */}
        {activeView === 'batch-students' && (
          <StudentTable
            students={students}
            selectedBatch={selectedBatch}
            loading={loading}
            onBackToBatches={handleBackToBatches}
            onAddStudentToBatch={(batchId) => handleOpenNewStudent(batchId)}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
          />
        )}

        {/* All Students View */}
        {activeView === 'all-students' && (
          <StudentTable
            students={students}
            selectedBatch={null}
            loading={loading}
            onBackToBatches={handleBackToBatches}
            onAddStudentToBatch={(batchId) => handleOpenNewStudent(batchId)}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
          />
        )}

        {/* Search Students View */}
        {activeView === 'search' && (
          <SearchStudent
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
            onViewBatch={handleViewBatchFromSearch}
          />
        )}
      </main>

      {/* Batch Create / Edit Modal Form */}
      {batchModalOpen && (
        <BatchForm
          batchToEdit={batchToEdit}
          onClose={() => setBatchModalOpen(false)}
          onSuccess={handleBatchSuccess}
        />
      )}

      {/* Student Register / Edit Modal Form */}
      {studentModalOpen && (
        <StudentForm
          studentToEdit={studentToEdit}
          batches={batches}
          initialBatchId={initialBatchIdForStudent}
          onClose={() => setStudentModalOpen(false)}
          onSuccess={handleStudentSuccess}
        />
      )}
    </div>
  );
}

export default App;
