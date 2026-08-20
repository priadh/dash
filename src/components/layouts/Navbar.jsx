import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../../supabaseClient';

const NavbarContainer = styled.nav`
  background-color: #0d0d0d;
  box-shadow: 0 5px 14px rgba(0, 255, 128, 0.2);    

  padding: 0.5rem 1rem; /* Reduced padding for sleekness */
  font-family: 'Segoe UI', sans-serif;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavbarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1140px;
  margin: 0 auto;
  padding: 0;
`;

const Logo = styled(Link)`
  font-size: 1.3rem; /* Slightly smaller font size */
  font-weight: 700;
  color: #ffffff;
  text-decoration: none;
  letter-spacing: 1px;
  transition: color 0.3s ease;

  &:hover {
    color: #1db954;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  transition: all 0.3s ease-in-out;

  @media (max-width: 768px) {
    flex-direction: column;
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    background-color: #0d0d0d;
    padding: 1rem;
    box-shadow: 0 8px 16px rgba(255, 255, 255, 0.05);
    display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  }
`;

const NavLink = styled(Link)`
  margin-left: 1.2rem; /* Reduced margin */
  color: #ffffff !important;
  font-weight: 500;
  font-size: 0.95rem; /* Reduced font size */
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover,
  &:focus {
    color: #1db954 !important;
  }
 &:visited {
    color: #ffffff ;
  }
  @media (max-width: 768px) {
    margin: 0.5rem 0;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.8rem; /* Slightly smaller font size */
  color: white;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const PostJobButton = styled(Link)`
  background: linear-gradient(135deg, #1db954, #1ed760);
  color: #ffffff ;
  padding: 0.3rem 0.9rem;
  font-size: 0.9rem;
  border-radius: 20px;
  margin-left: 1rem;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 3px 10px rgba(30, 215, 96, 0.3);
  transition: all 0.3s ease;  /* Transition all properties including background and transform */

  &:hover, &:focus, &:active {
    background: linear-gradient(135deg, #1ed760, #1db954);
    transform: scale(1.05);
    color: #ffffff ;  /* Ensures text stays white, use !important to force override */
  }

  @media (max-width: 768px) {
    margin: 0.5rem 0;
    width: 100%;
    text-align: center;
  }
`;



const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #ffffff;
  font-weight: 500;
  cursor: pointer;
  margin-left: 1.2rem; /* Reduced margin */
  transition: color 0.3s ease;
  font-size: 0.95rem; /* Reduced font size */

  &:hover {
    color: #ff4d4d;
  }
`;

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasPostedJob, setHasPostedJob] = useState(false);
  const navigate = useNavigate();

  const checkIfUserPosted = async (userId) => {
    const { data: jobs, error: jobError } = await supabase
      .from('jobs')
      .select('uuid')
      .eq('user_id', userId)
      .limit(1);

    if (jobError) {
      console.error('Job fetch error:', jobError);
      setHasPostedJob(false);
    } else {
      setHasPostedJob(jobs.length > 0);
    }
  };

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser();
    const userId = data?.user?.id;

    if (userId) {
      setIsAuthenticated(true);
      checkIfUserPosted(userId);
    } else {
      setIsAuthenticated(false);
      setHasPostedJob(false);
    }
  };

  useEffect(() => {
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const userId = session?.user?.id;
        setIsAuthenticated(!!session);

        if (userId) {
          checkIfUserPosted(userId);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    navigate('/');
  };
  return (
    <NavbarContainer>
      <NavbarContent>
        <Logo to="/">Gnixjobs</Logo>
        <MenuButton onClick={toggleMenu} aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}>
          {isMenuOpen ? '✕' : '☰'}
        </MenuButton>
        <NavLinks $isOpen={isMenuOpen}>
          {/* <NavLink to="/jobs">Find Jobs</NavLink> */}
         
          <NavLink to="/find-jobs">Find Jobs</NavLink>

          <NavLink to="/companies">Companies</NavLink>
 {isAuthenticated && hasPostedJob && (
          <NavLink to="/dashboard">Dashboard</NavLink>
        )}

          {isAuthenticated ? (
            <>
              {/* <NavLink to="/profile">Profile</NavLink> */}
              <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}


          <PostJobButton to="/post-job">Post a Job</PostJobButton>
        </NavLinks>
      </NavbarContent>
    </NavbarContainer>
  );
};

export default Navbar;
