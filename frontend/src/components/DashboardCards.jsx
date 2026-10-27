import React from 'react';
import { Layers, Users, BookOpen, Calculator } from 'lucide-react';

const DashboardCards = ({ stats, loading, onCardClick }) => {
  const cards = [
    {
      id: 'batches',
      title: 'Total Batches',
      value: stats ? stats.totalBatches : 0,
      icon: <Layers size={26} />,
      colorClass: 'stat-card-blue',
      iconClass: 'stat-icon-blue',
      onClick: () => onCardClick && onCardClick('batches'),
    },
    {
      id: 'students',
      title: 'Total Students',
      value: stats ? stats.totalStudents : 0,
      icon: <Users size={26} />,
      colorClass: 'stat-card-green',
      iconClass: 'stat-icon-green',
      onClick: () => onCardClick && onCardClick('all-students'),
    },
    {
      id: 'courses',
      title: 'Distinct Courses',
      value: stats ? stats.totalCourses : 0,
      icon: <BookOpen size={26} />,
      colorClass: 'stat-card-purple',
      iconClass: 'stat-icon-purple',
      onClick: () => onCardClick && onCardClick('batches'),
    },
    {
      id: 'average',
      title: 'Avg Students / Batch',
      value: stats ? (typeof stats.averageStudentsPerBatch === 'number' ? stats.averageStudentsPerBatch.toFixed(1) : stats.averageStudentsPerBatch) : '0.0',
      icon: <Calculator size={26} />,
      colorClass: 'stat-card-amber',
      iconClass: 'stat-icon-amber',
      onClick: () => onCardClick && onCardClick('batches'),
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <div
          key={card.id}
          className={`stat-card ${card.colorClass}`}
          onClick={card.onClick}
          style={{ cursor: 'pointer' }}
          title={`Click to view ${card.title}`}
        >
          <div className="stat-info">
            <h3>{card.title}</h3>
            <div className="stat-number">
              {loading ? '...' : card.value}
            </div>
          </div>
          <div className={`stat-icon-wrapper ${card.iconClass}`}>
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
