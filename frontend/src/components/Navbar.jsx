import React from 'react';
import {
  LayoutDashboard,
  Layers,
  UserPlus,
  FolderPlus,
  Search,
  Users,
  GraduationCap
} from 'lucide-react';

const Navbar = ({ activeView, setActiveView, onOpenNewBatch, onOpenNewStudent }) => {
  return (
    <header className="navbar-wrapper">
      <div className="navbar">
        <div className="navbar-brand" onClick={() => setActiveView('dashboard')}>
          <div className="brand-icon-box">
            <GraduationCap size={26} strokeWidth={2.2} />
          </div>
          <div className="brand-text">
            <h1>EduSphere</h1>
            <p>Training Batch Management System</p>
          </div>
        </div>

        <nav className="navbar-nav">
          <button
            className={`nav-link ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveView('dashboard')}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            className={`nav-link ${activeView === 'batches' ? 'active' : ''}`}
            onClick={() => setActiveView('batches')}
          >
            <Layers size={18} />
            Batches
          </button>

          <button
            className={`nav-link ${activeView === 'all-students' ? 'active' : ''}`}
            onClick={() => setActiveView('all-students')}
          >
            <Users size={18} />
            All Students
          </button>

          <button
            className={`nav-link ${activeView === 'search' ? 'active' : ''}`}
            onClick={() => setActiveView('search')}
          >
            <Search size={18} />
            Search Student
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={onOpenNewBatch}
            style={{ marginLeft: '0.5rem' }}
          >
            <FolderPlus size={16} />
            + New Batch
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={onOpenNewStudent}
          >
            <UserPlus size={16} />
            + Add Student
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
