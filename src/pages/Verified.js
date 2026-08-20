import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const Verified = () => {
  const [message, setMessage] = useState('Verifying your session...');
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const hash = window.location.hash;
      const searchParams = new URLSearchParams(window.location.search);
      const hasOAuthCode = searchParams.has('code') && searchParams.has('code_verifier');

      try {
        // ✅ Email link (Magic link)
        if (hash.includes('access_token')) {
          const { error } = await supabase.auth.getSessionFromUrl();
          if (error) throw error;

          setMessage('✅ Email verified! Redirecting...');
          setTimeout(() => navigate('/login'), 3000);
        }

        // ✅ OAuth login
        else if (hasOAuthCode) {
          const { error } = await supabase.auth.exchangeCodeForSession({
            code: searchParams.get('code'),
            codeVerifier: searchParams.get('code_verifier'),
          });
          if (error) throw error;

          setMessage('✅ OAuth login successful! Redirecting...');
          setTimeout(() => navigate('/login'), 3000);
        }

        // ❌ Nothing matched
        else {
          setMessage('❌ Invalid or expired verification link.');
        }

      } catch (err) {
        console.error('Verification error:', err.message);
        setMessage('❌ Verification failed. Please try again.');
      }
    };

    verify();
  }, [navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.text}>{message}</h2>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#0e0e0e',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#1a1a1a',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
  },
  text: {
    color: '#00bfa6',
    fontSize: '1.2rem',
    textAlign: 'center',
  },
};

export default Verified;
