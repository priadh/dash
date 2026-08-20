import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../supabaseClient';
import { Briefcase, MapPin, ArrowUpRight,ArrowRight } from 'lucide-react';
import { createGlobalStyle } from 'styled-components';

const PageGlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    background-color: #000;
    color: white;
  }
`;

// Styled Components
const OuterWrapper = styled.div`
  background-color: #000;
  min-height: 100vh;
  padding: 60px 20px;
  color: white;
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background-color: #111;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
`;

const Intro = styled.p`
  color: #aaa;
  font-size: 14px;
  text-align: left;
`;

const JobTitle = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin: 8px 0 20px;
  text-align: left;
`;

const PillsWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const Pill = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #222;
  color: #ccc;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 14px;
`;

const ApplyPill = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #22c55e;
  color: white;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background-color: #16a34a;
  }

  a {
    color: white;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const Description = styled.div`
  font-size: 16px;
  line-height: 1.8;
  color: #eee;
  text-align: left;

  & p {
    margin-bottom: 16px;
  }
`;

const JobDetailsPage = () => {
  const [user, setUser] = useState(null);

useEffect(() => {
  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  getUser();
}, []);

  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('uuid', id)
        .single();

      if (error) {
        console.error('Error fetching job:', error.message);
      } else {
        setJob(data);
      }
    };

    fetchJob();
  }, [id]);

  if (!job) {
    return <OuterWrapper>Loading...</OuterWrapper>;
  }

 return (
  <>
    <PageGlobalStyle />
    <OuterWrapper>
      <ContentWrapper>
        <Intro>{job.company} is hiring a</Intro>
        <JobTitle>{job.title}</JobTitle>

        <PillsWrapper>
          <Pill>
            <Briefcase size={16} />
            {job.job_type}
          </Pill>
          <Pill>
            <MapPin size={16} />
            {job.location}
          </Pill>
         {job.apply_link && (
  <ApplyPill as="a" href={user ? job.apply_link : "/login"} target={user ? "_blank" : "_self"}>
    {user ? (
      <>
        Apply <ArrowUpRight size={16} />
      </>
    ) : (
      <>
Login to Apply <ArrowRight size={16} strokeWidth={2.5} style={{ verticalAlign: 'middle', position: 'relative', top: '2px' }} />
      </>
    )}
  </ApplyPill>
)}

        </PillsWrapper>

        <Description dangerouslySetInnerHTML={{ __html: job.description }} />
      </ContentWrapper>
    </OuterWrapper>
  </>
);

};

export default JobDetailsPage;
