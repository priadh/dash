import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Lock, Mail } from 'lucide-react';

// Styled Components
import { createGlobalStyle } from 'styled-components';

// Global styles only for this page
const LoginPageGlobalStyle = createGlobalStyle`
  body, html, #root {
    background-color: #000;
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', sans-serif;
    height: 100%;
    overflow: hidden;
  }
`;

const LoginPageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #000;
`;

const LoginCard = styled.div`
  background: rgba(17, 17, 17, 0.8);
  border-radius: 16px;
  padding: 24px;
  width: 400px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 18px;
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: rgb(85, 219, 90);
`;

const InputField = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #444;
  border-radius: 50px;
  font-size: 14px;
  background: rgba(34, 34, 34, 0.8);
  color: #eee;
  outline: none;
  transition: all 0.3s ease;

  &::placeholder {
    color: #bbb;
  }

  &:focus {
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.3);
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover, 
  &:-webkit-autofill:focus, 
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0px 1000px rgba(34, 34, 34, 0.8) inset !important;
    -webkit-text-fill-color: #eee !important;
    caret-color: #eee;
    transition: background-color 5000s ease-in-out 0s;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #009624;
  border: none;
  border-radius: 50px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background:rgb(15, 128, 43);
  }
`;

const ErrorMessage = styled.div`
  color: #FF6B6B;
  font-size: 12px;
  margin-top: 8px;
  text-align: center;
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 16px;
  color: #ccc;
  font-size: 14px;
`;

const LoginButton = styled.span`
  color: #4CAF50;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    // text-decoration: underline;
    color: #388E3C;
  }
`;

const Separator = styled.div`
  text-align: center;
  margin: 20px 0;
  color: #999;
  font-size: 12px;
  position: relative;

  &::before, &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 40%;
    height: 1px;
    background: #444;
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }
`;

const GoogleButton = styled.button`
  width: 100%;
  padding: 10px;
  background: white;
  color: #333;
  border: none;
  border-radius: 50px;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px; /* adds space between icon and text */

  &:hover {
    background: #f0f0f0;
  }
`;


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate('/JobCard');
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) setError(error.message);
  };

  return (
    <>
    <LoginPageGlobalStyle /> 
    <LoginPageWrapper>
      <LoginCard>
        <h2 style={{ textAlign: 'center', color: '#fff' }}>Login</h2>
        <form onSubmit={handleSubmit}>
          <InputWrapper>
            <IconWrapper><Mail size={18} /></IconWrapper>
            <InputField
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </InputWrapper>

          <InputWrapper>
            <IconWrapper><Lock size={18} /></IconWrapper>
            <InputField
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </InputWrapper>

          <SubmitButton type="submit">Login</SubmitButton>
        </form>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Separator>OR</Separator>
    <GoogleButton onClick={handleGoogleSignIn}>  Sign in with Google
  <img
    src="https://developers.google.com/identity/images/g-logo.png"
    alt="Google logo"
    style={{ height: '20px', marginRight: '10px' }}
  />

</GoogleButton>

        <LoginLink>
          Don't have an account? <LoginButton onClick={() => navigate('/register')}>Register Now</LoginButton>
        </LoginLink>
      </LoginCard>
    </LoginPageWrapper>
      </>
  );
};

export default Login;
