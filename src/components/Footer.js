import React from 'react';

const jobCategories = [
  'Finance', 'Accounting', 'Frontend', 'Backend', 'Full Stack', 'Blockchain', 'Solidity', 'Rust',
  'Defi', 'Engineer', 'Smart Contract', 'NFT', 'Design', 'Sales & Marketing', 'Product',
  'Customer Support', 'InfoSec', 'Management & Finance', 'No-Code', 'DevOps', 'Crypto',
  'Solana', 'Ethereum', 'Community Manager', 'Writer', 'Non-Tech', 'Human Resources(HR)',
];

// Define the slugify function
const slugify = (text) => text.toLowerCase().replace(/\s+/g, '-');

// Define the columns array
const columns = [[], [], [], []];
jobCategories.forEach((cat, i) => {
  columns[i % 4].push(cat);
});

const Footer = () => {
  const handleCategoryClick = (category) => {
    window.location.href = `/category/${slugify(category)}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={styles.wrapper}>
      <footer style={styles.footer}>
        <div style={styles.container}>
          {/* Left Section */}
          <div style={styles.leftCol}>
            <div style={styles.linksRow}>
  <a
  href="https://t.me/yourchannel"
  target="_blank"
  rel="noopener noreferrer"
  style={styles.pillButton}
>
  Telegram
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg"
    alt="Telegram"
    style={{ width: '18px', height: '18px', marginLeft: '8px' }}
  />
</a>



 <a
  href="https://x.com/yourhandle"
  target="_blank"
  rel="noopener noreferrer"
  style={styles.pillButton}
>
  Report Bug
  <img
    src="/X-Logo-Twitter-Logo-Iconic-Social-Media-Brand-Symbol-PNG-Transparent-Recognizable-Emblem.png"
    alt="X"
    style={{ width: '20px', height: '20px', marginLeft: '6px' }}
  />
</a>



            </div>
            <p style={styles.muted}>Crafted by YourName</p>
            <p style={styles.text}>© {new Date().getFullYear()} Gnixjobs</p>
          </div>

          {/* Right Section */}
          <div style={styles.rightCol}>
            <div style={styles.columnsWrapper}>
              {columns.map((col, i) => (
                <div key={i} style={styles.column}>
                  {col.map((cat) => (
                    <span
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => (e.key === 'Enter' ? handleCategoryClick(cat) : null)}
                      style={styles.categoryLink}
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  footer: {
    backgroundColor: '#000',
    color: '#dddddd',
    padding: '40px 20px',
    marginTop: 'auto',
    width: '100%',
    fontFamily: 'sans-serif',
    boxShadow: '0 -4px 20px rgba(0, 255, 128, 0.2)',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    minWidth: '220px',
  },
  rightCol: {
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-end',
  },
  text: {
    margin: 0,
    fontSize: '14px',
    fontWeight: '500',
  },
  muted: {
    margin: 0,
    fontSize: '14px',
    color: '#aaa',
  },
  linksRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  pillButton: {
    display: 'inline-flex',
    alignItems: 'center',
  background:' #009624',
    color: '#fff',
    fontWeight: '700',
    padding: '6px 12px',
    borderRadius: '9999px',
    textDecoration: 'none',
    fontSize: '13px',
    transition: 'all 0.3s ease-in-out',
    boxShadow: '0 3px 8px rgba(30, 215, 96, 0.3)',
    
    
  },
  columnsWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '40px',
    justifyContent: 'flex-end',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    minWidth: '140px',
    textAlign: 'left',

  },
  categoryLink: {
    fontSize: '14px',
    color: '#fff',
    textDecoration: 'none',
    cursor: 'pointer',
    fontWeight: '550',
    outline: 'none',
    transition: 'color 0.2s',
  },
};

// Add hover style with inline style workaround
styles.categoryLink[':hover'] = {
  color: '#1ed760',
};

export default Footer;
