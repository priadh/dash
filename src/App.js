import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/layouts/Navbar';
import Container from './components/layouts/Container';
import JobCard from './components/jobs/JobCard';
import PostJob from './pages/PostJob';
import Payment from './pages/Payment';
import GlobalStyles from './styles/GlobalStyles';
import PostedJobs from './pages/PostedJobs';
import AuthForm from './components/AuthForm';
import Login from './pages/Login';
import Register from './pages/Register';
import Verified from './pages/Verified';
import FindJobsPage from './pages/FindJobsPage';  // Import the new page
import Footer from './components/Footer'; // adjust path as needed
import { supabase } from './supabaseClient'; // Make sure this is correct
import jobcard from './components/jobs/JobCard';
import CategoryPage from './components/CategoryPage';
import JobDetailsPage from './pages/JobDetailsPage';
// import useHasPostedJobs from './components/jobs/useHasPostedJobs';
import Dashboard from './pages/Dashboard'; // Correct if Dashboard is here
import { useLocation } from 'react-router-dom'; // 🔁 Add this import


import './App.css';

// import { Navigate } from 'react-router-dom';

// const ProtectedDashboard = () => {
//   const { hasPosted, loading } = useHasPostedJobs();

//   if (loading) return <p>Checking job status...</p>;
//   if (!hasPosted) return <Navigate to="/" replace />;

//   return <EmployerDashboard />;
// };


const dummyJobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'TechCorp',
    companyLogo: null,
    location: 'Remote',
    jobType: 'Full-time',
    salary: '$80k - $100k',
    tags: ['React', 'JavaScript', 'CSS'],
    createdAt: new Date().toISOString(),
    featured: true,
  },
];

function HomePage() {
  return (
    <Container>
      <div style={{ display: 'grid', gap: '20px', marginBottom: '2rem' }}>
        {dummyJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </Container>
  );
}

function AppWrapper() {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Get current path

  useEffect(() => {
    const handleRedirect = async () => {
      const { data, error } = await supabase.auth.exchangeCodeForSession();

      if (data?.session) {
        console.log('Session established:', data.session);
        navigate('/verified');
      } else if (error) {
        console.error('Email confirmation error:', error.message);
      }
    };

    if (window.location.href.includes('#')) {
      handleRedirect();
    }
  }, [navigate]);
    const hideFooterRoutes = ['/register'];
  const shouldShowFooter = !hideFooterRoutes.includes(location.pathname);

  return (
    <>
      <Navbar />
      <main style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/jobs" element={<PostedJobs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth" element={<AuthForm />} />
          <Route path="/verified" element={<Verified />} />
          <Route path="/find-jobs" element={<FindJobsPage />} />
          <Route path="/jobcard" element={<JobCard />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
          <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/dashboard" element={<Dashboard />} />

        </Routes>
        {shouldShowFooter && <Footer />}
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <GlobalStyles />
      <div className="App">
        <AppWrapper />
      </div>
    </Router>
  );
}

export default App;
