// src/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';
import theme from './theme';

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body {
    height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    background-color: #f5f8fa;
    color: #333;
  }
  
  #root {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  a {
    color: #0070f3;
    text-decoration: none;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: 1rem;
  }
  
  p {
    margin-bottom: 1rem;
  }

  img {
    max-width: 100%;
    height: auto;
  }
  
  button, input, select, textarea {
    font-family: inherit;
    font-size: inherit;
  }
`;

export default GlobalStyles;
