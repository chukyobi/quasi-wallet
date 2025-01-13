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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      <div style={styles.loaderWrapper}>
        <img
          src="/assets/goldman.png"  
          alt="Goldman Preloader"
          style={styles.logo}
        />
      </div>
    </div>
  );
};

const styles = {
  loaderWrapper: {
    textAlign: 'center' as 'center', 
    fontFamily: 'Arial, sans-serif' as string,
  },
  logo: {
    width: '100px', 
    height: '100px', 
    animation: 'zoomInOut 2s ease-in-out infinite', 
  },
};

export default Preloader;
