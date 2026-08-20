import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import JobDetail from './pages/JobDetail';
import PostJob from './pages/PostJob';
import Login from './pages/Login';
import Register from './pages/Register';
// import PostJob from "./pages/PostJob";
import Payment from "./pages/Payment";
import Verified from "./pages/Verified";
import JobCard from './components/jobs/JobCard';
import JobCard from './components/jobs/JobCard';


const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/jobs/:id" element={<JobDetail />} />
      <Route path="/post-job" element={<PostJob />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/PostJob" element={<PostJob />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/verified" element={<Verified />} />
      <Route path="/jobcard" element={<JobCard />} /> 

    </Routes>
  </Router>
);

export default AppRoutes;
