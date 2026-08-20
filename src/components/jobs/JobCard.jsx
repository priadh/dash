import React, { useEffect, useState, useRef } from 'react'; 
import { Link } from 'react-router-dom';
import { formatDistanceToNow, parseISO } from 'date-fns';
import styled, { createGlobalStyle } from 'styled-components';
import { supabase } from '../../supabaseClient';

// Global Styles
const GlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    background-color: #000;
    color: #fff !important;
    font-family: 'Arial', sans-serif;
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: auto;
  padding: 20px;
  background-color: #1e1e1e !important;
  border-radius: 10px;
`;

const JobRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px 0;
  border-bottom: 1px solid #444;
  position: relative;
  transition: 0.3s ease;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
  }

  &:hover .view-button {
    opacity: 1;
    transform: translateY(0);
  }

  &:hover .time-text {
    opacity: 0;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  text-align: left;
  flex: 1;
`;

const Logo = styled.img`
  width: 46px;
  height: 46px;
  border-radius: 6px;
  object-fit: cover;
  background: #333;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const Company = styled.span`
  color: #bbb;
  font-size: 12px;
  text-transform: uppercase;
`;

const Title = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
`;

const Meta = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: #aaa;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  line-height: 1.3;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  white-space: nowrap;
`;

const Time = styled.div`
  color: #bbb;
  font-size: 12px;
  transition: 0.3s ease;
  opacity: 1;
`;

const ViewButton = styled(Link)`
  background: #009624;
  color: white !important;
  font-weight: 500;
  border-radius: 999px;
  padding: 5px 14px;
  font-size: 12px;
  text-decoration: none;
  transition: 0.3s ease;
  opacity: 0;
  transform: translateY(-8px);
  position: absolute;
  top: 0;
  right: 0;

  &:hover {
    background: #00c853;
  }
`;

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const fetchJobs = async () => {
      if (loading) return;

      setLoading(true);
      const currentDate = new Date().toISOString();
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('feature_job', true)
        .gte('featured_until', currentDate)
        .order('uuid', { ascending: true })
        .range((page - 1) * 10, page * 10 - 1); // Fetch 10 jobs per page

      if (error) {
        console.error('Error fetching jobs:', error.message);
      } else {
        setJobs((prevJobs) => [...prevJobs, ...data]); // Append new jobs
      }

      setLoading(false);
    };

    fetchJobs();
  }, [page]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1); // Load next page
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, []);

  return (
    <>
      <GlobalStyle />
      <h1 style={{ marginTop: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
        Find Your Dream Job
      </h1>
      <Container>
        {jobs.length === 0 ? (
          <p>No featured jobs available at the moment.Click on 'Find Jobs' for jobs.</p>
        ) : (
          jobs.map((job) => (
            <JobRow key={job.uuid}>
              <Left>
              <Logo
  src={job.logo_url || '/default-logo.png'}
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = '/default-logo.png';
  }}
  alt="Company Logo"
/>

                <Info>
                  <Company>{job.company}</Company>
                  <Title>{job.title}</Title>
                  <Meta>
                    <span>💼 {job.job_type || 'Full-Time'}</span>
                    {job.location && <span>📍 {job.location}</span>}
                    {job.salary && <span>💰 {job.salary}</span>}
                  </Meta>
                </Info>
              </Left>
              <Right>
                <Time className="time-text">
                  {job.time && formatDistanceToNow(parseISO(job.time), { addSuffix: true })}
                </Time>
                <ViewButton to={`/jobs/${job.uuid}`} className="view-button">
                  View Job →
                </ViewButton>
              </Right>
            </JobRow>
          ))
        )}
        {loading && <p>Loading...</p>} {/* Show loading text */}
        <div ref={loadMoreRef}></div> {/* Empty div to trigger observer */}
      </Container>
    </>
  );
};

export default JobList;
