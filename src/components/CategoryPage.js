import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { formatDistanceToNow, parseISO } from 'date-fns';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    background-color: #000;
    color: #fff;
    font-family: 'Arial', sans-serif;
  }

  body {
    min-height: 100vh;
  }
`;


const Container = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: auto;
  padding: 20px;
  background-color: #1e1e1e;
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
  background-color: ${(props) => (props.featured ? '#009624' : 'transparent')};

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

const ViewButton = styled.div`
  background: #009624;
  color: white;
  font-weight: 500;
  border-radius: 999px;
  padding: 5px 14px;
  font-size: 12px;
  cursor: pointer;
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
const ToggleButton = styled.button`
  background-color: ${(props) => (props.active ? '#00c853' : '#222')};
  color: ${({ active }) => (active ? '#000' : '#ccc')};
  border: 1px solid ${({ active }) => (active ? '#00c853' : '#444')};
  border-radius: 999px;
 padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s ease;  margin-right: 12px;
  cursor: pointer;

  &:hover {
    border-color: #00c853; /* This line forces the border to turn the usual green */
  }
`;

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);
  const LIMIT = 10;
  const [filterFeatured, setFilterFeatured] = useState(false);
  const [filterRemote, setFilterRemote] = useState(false);

  const category = categorySlug ? categorySlug.replace('-', ' ') : null;
const isNonTech = categorySlug === 'non-tech';


  
  const fetchJobs = useCallback(async () => {
    if (!category || loading || !hasMore) return;
    setLoading(true);

    const from = page * LIMIT;
    const to = from + LIMIT - 1;
    
const nonTechKeywords = [
  'hr', 'sales', 'marketing', 'admin', 'operations', 'support',
  'accountant', 'finance', 'teacher', 'trainer', 'writer', 'legal'
];

const orQuery = nonTechKeywords
  .map(word => `title.ilike.%${word}%`)
  .join(',');
   const now = new Date().toISOString();

const { data, error } = await supabase
  .from('jobs')
  .select('*')
  // .ilike('title', `%${category}%`)
   .or(
    isNonTech
      ? 'title.ilike.%hr%,title.ilike.%sales%,title.ilike.%marketing%,title.ilike.%admin%,title.ilike.%operations%,title.ilike.%support%,title.ilike.%accountant%,title.ilike.%finance%,title.ilike.%teacher%,title.ilike.%trainer%,title.ilike.%writer%,title.ilike.%legal%'
      : `title.ilike.%${category}%`
  )
  .or(`expires_at.gt.${now},expires_at.is.null`) // ✅ Add this to keep only active jobs
  .order('time', { ascending: false })
  .range(from, to);


    if (error) {
      console.error('Error fetching jobs:', error.message);
    } else {
      if (data.length < LIMIT) setHasMore(false);
      setJobs((prev) => [...prev, ...data]);
      setPage((prev) => prev + 1);
    }

    setLoading(false);
  }, [category, page, hasMore, loading]);


  
  // Load initial jobs
  useEffect(() => {
    setJobs([]);
    setPage(0);
    setHasMore(true);
  }, [category]);

  // Observe the loadMoreRef to trigger paginated fetching
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchJobs();
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchJobs]);

  return (
    <>
      <GlobalStyle />
      <h1 style={{ marginTop: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
        {category ? `Jobs in ${category}👍` : 'Invalid Category'}
      </h1>
<div style={{ marginBottom: '1rem' }}>
        <ToggleButton
          active={filterFeatured}
          onClick={() => {
            setJobs([]);
            setPage(0);
            setHasMore(true);
            setFilterFeatured(!filterFeatured);
          }}
        >
          Featured
        </ToggleButton>
        <ToggleButton
          active={filterRemote}
          onClick={() => {
            setJobs([]);
            setPage(0);
            setHasMore(true);
            setFilterRemote(!filterRemote);
          }}
        >
          Remote
        </ToggleButton>
      </div>
      <Container>
        
        {jobs.map((job) => (
          <JobRow key={job.id} featured={job.featured}>
            <Left>
              <Logo
                src={job.companyLogo || '/default-logo.png'}
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
              <ViewButton
                onClick={() => (window.location.href = `/jobs/${job.id}`)}
                className="view-button"
              >
                View Job →
              </ViewButton>
            </Right>
          </JobRow>
        ))}
        {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}
        {!hasMore && !loading && <p style={{ textAlign: 'center' }}>No more jobs to load.</p>}
        <div ref={observerRef}></div>
      </Container>
    </>
  );
};

export default CategoryPage;
