import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignupOptions = () => {
  const navigate = useNavigate();

  const handleSignup = (role) => {
    navigate(`/signup?role=${role}`);
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  };

  const titleStyle = {
    fontSize: '2.5rem',
    marginBottom: '40px',
    color: '#333',
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '30px',
  };

  const buttonStyle = {
    padding: '15px 30px',
    fontSize: '1.2rem',
    textDecoration: 'none',
    borderRadius: '8px',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    color: 'white',
    cursor: 'pointer',
  };

  const userButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#4CAF50',
  };

  const adminButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#2196F3',
  };

  const handleMouseEnter = (e) => {
    e.target.style.transform = 'scale(1.05)';
  };

  const handleMouseLeave = (e) => {
    e.target.style.transform = 'scale(1)';
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Choose Your Signup Role</h2>
      <div style={buttonGroupStyle}>
        <div
          style={userButtonStyle}
          onClick={() => handleSignup('user')}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Sign Up as User
        </div>
        <div
          style={adminButtonStyle}
          onClick={() => handleSignup('admin')}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Sign Up as Admin
        </div>
      </div>
    </div>
  );
};

export default SignupOptions;
