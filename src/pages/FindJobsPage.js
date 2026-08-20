import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow, parseISO } from 'date-fns';
import styled, { createGlobalStyle } from 'styled-components';
import { supabase } from '../supabaseClient';

// --- Job Categories
const jobCategories = [
  'Finance', 'Accounting', 'Frontend', 'Backend', 'Full Stack', 'Blockchain', 'Solidity', 'Rust',
  'Defi', 'Engineer', 'Smart Contract', 'NFT', 'Design', 'Sales & Marketing', 'Product',
  'Customer Support', 'InfoSec', 'Management & Finance', 'No-Code', 'DevOps', 'Crypto',
  'Solana', 'Ethereum', 'Community Manager', 'Writer', 'Non-Tech',
];

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    background-color:rgb(0, 0, 0);
    color: #fff; 
    font-family: 'Arial', sans-serif; 
  }
`;

const PageWrapper = styled.div`
  width: 100%;
  background-color:rgb(0, 0, 0);
  min-height: 100vh;
`;

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 20px 40px;
  justify-content: center;
`;

const FilterButton = styled.button`
  background-color: ${({ active }) => (active ? '#00c853' : '#222')};
  color: ${({ active }) => (active ? '#000' : '#ccc')};
  border: 1px solid ${({ active }) => (active ? '#00c853' : '#444')};
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    // background-color: ${({ active }) => (active ? '#00e676' : '#333')};
    border-color: #00c853; /* This line forces the border to turn the usual green */
  }
`;


const ToggleButton = styled(FilterButton)`
  background-color: ${({ active }) => (active ? '#00c853' : '#222')};
`;

const ClearButton = styled(FilterButton)`
  background-color: ${({ active }) => (active ? '#00c853' : '#222')};
  color: #ccc;
  border: 1px solid #555;

  &:hover {
    // background: #555;
  }
`;

const Dropdown = styled.select`
  background: #222;
  color: #ccc;
  border-radius: 20px;
  padding: 6px 12px;
  border: 1px solid #444;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #00c853;
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: auto;
  padding: 20px;
  background-color: #1e1e1e;
  border-radius: 10px;
  margin-bottom: 60px;
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
  color: white;
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

const CategoryPills = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin: 10px 0 30px;
  
`;

const FindJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    remoteOnly: false,
    location: '',
    category: '',
  });

  const [showJobType, setShowJobType] = useState(false);

 useEffect(() => {
  const fetchJobs = async () => {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .or(`expires_at.gt.${now},expires_at.is.null,feature_job.eq.true`)
    .order('time', { ascending: false });

  if (error) {
    console.error('Error fetching jobs:', error.message);
  } else {
    setJobs(data);
    setFilteredJobs(data);
  }
};


  fetchJobs();
}, []);


  useEffect(() => {
    let temp = [...jobs];

    if (filters.type) {
      temp = temp.filter((job) => job.job_type?.toLowerCase() === filters.type.toLowerCase());
    }

    if (filters.remoteOnly) {
      temp = temp.filter((job) => job.location?.toLowerCase().includes('remote'));
    }

    if (filters.category) {
      temp = temp.filter((job) =>
        job.title?.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    setFilteredJobs(temp);
  }, [filters, jobs]);

  const updateFilter = (key, value) => {
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [key]: prev[key] === value ? '' : value,
      };
  
      if (key === 'type') {
        setShowJobType(false);  // Hide pills after selecting a job type
      }
  
      return newFilters;
    });
  };
  
  const clearFilters = () => {
    setFilters({ type: '', remoteOnly: false, location: '', category: '' });
    setShowJobType(false);
  };

  const toggleJobType = () => {
    setShowJobType(!showJobType);
  };

  return (
    <PageWrapper>
      <GlobalStyle />
      <FilterBar>
        <div onClick={toggleJobType} style={{ cursor: 'pointer' }}>
          <ToggleButton active={filters.type ? true : false}>
            {filters.type || 'Job Type'}
          </ToggleButton>
        </div>
        {showJobType && (
          <div>
            <FilterButton active={filters.type === 'Full-Time'} onClick={() => updateFilter('type', 'Full-Time')}>Full-Time</FilterButton>
            <FilterButton active={filters.type === 'Part-Time'} onClick={() => updateFilter('type', 'Part-Time')}>Part-Time</FilterButton>
            <FilterButton active={filters.type === 'Freelance'} onClick={() => updateFilter('type', 'Freelance')}>Freelance</FilterButton>
            <FilterButton active={filters.type === 'Internship'} onClick={() => updateFilter('type', 'Internship')}>Internship</FilterButton>
          </div>
        )}
        <ToggleButton
          active={filters.remoteOnly}
          onClick={() => updateFilter('remoteOnly', !filters.remoteOnly)}
        >
          Remote Only
        </ToggleButton>

        <ClearButton onClick={clearFilters}>Clear All</ClearButton>
      </FilterBar>

      <CategoryPills>
        {jobCategories.map((cat) => (
          <FilterButton
            key={cat}
            active={filters.category === cat}
            onClick={() => updateFilter('category', cat)}
          >
            {cat}
          </FilterButton>
        ))}
      </CategoryPills>

      <Container>
        {filteredJobs.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px 0', color: '#aaa', fontSize: '16px' }}>
            No jobs found.
          </p>
        ) : (
          filteredJobs.map((job) => (
            <JobRow key={job.uuid}>
              <Left>
        <Logo
  src={job.logo_url || '/default-logo.png'}
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = '/default-logo.png';
  }}
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
      </Container>
    </PageWrapper>
  );
};

export default FindJobsPage;
