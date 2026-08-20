import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const PostedJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
      } else {
        setJobs(data);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>All Posted Jobs</h2>
      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {jobs.map((job) => (
            <li
              key={job.id}
              style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
              }}
            >
              <h3>{job.title}</h3>
              <p><strong>Company:</strong> {job.company}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Type:</strong> {job.job_type}</p>
              <p><strong>Salary:</strong> {job.salary}</p>
              <p>{job.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostedJobs;
