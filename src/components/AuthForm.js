// src/components/AuthForm.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authType, setAuthType] = useState('login'); // or 'signup'
  const [message, setMessage] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage('');

    if (authType === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else setMessage('Logged in successfully');
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage(error.message);
      else setMessage('Signup successful. Please check your email to confirm.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>{authType === 'login' ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleAuth}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br /><br />
        <button type="submit">{authType === 'login' ? 'Login' : 'Sign Up'}</button>
      </form>
      <br />
      <button onClick={() => setAuthType(authType === 'login' ? 'signup' : 'login')}>
        Switch to {authType === 'login' ? 'Sign Up' : 'Login'}
      </button>
      <p style={{ color: 'red' }}>{message}</p>
    </div>
  );
};

export default AuthForm;
