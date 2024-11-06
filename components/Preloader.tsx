import React from 'react';

const Preloader: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Transparent background
        zIndex: 9999,
        overflow: 'hidden', // Ensure no scrollbars
      }}
    >
      <div style={styles.loaderWrapper}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading...</p>
      </div>
    </div>
  );
};

const styles = {
  loaderWrapper: {
    textAlign: 'center' as 'center', // Explicitly casting to 'center'
    fontFamily: 'Arial, sans-serif' as string,
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  loadingText: {
    fontSize: '20px',
    color: '#333',
    fontWeight: 'bold',
  },
};

export default Preloader;
