// src/components/layout/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import useHasPostedJobs from '../jobs/useHasPostedJobs'; // adjust import

const Sidebar = () => {
  const { hasPosted, loading } = useHasPostedJobs();

  return (
    <div className="sidebar space-y-4">
      <Link to="/">Home</Link>
      <Link to="/profile">Profile</Link>

      {!loading && hasPosted && (
        <Link to="/dashboard">Employer Dashboard</Link>
      )}
    </div>
  );
};

export default Sidebar;
