import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../store/authSlice';
import type { RootState, AppDispatch } from '../../store/store';
import { TextField, Button, Card, CircularProgress, Typography, Box } from '@mui/material';

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { isAuthenticated, isLoading, error } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redirect to Dashboard when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        bgcolor: 'background.default'
      }}
    >
      <Card 
        sx={{
          py: 6,
          px: 4,
          width: 400,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h5" align="left" fontWeight="bold" mb={3} gutterBottom>
          Log in to your account
        </Typography>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextField 
            label="Email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            fullWidth 
            required 
          />
          <TextField 
            label="Password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            fullWidth 
            required 
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ borderRadius: 1, height: 42 }}
            >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign in'}
          </Button>
            {error && <Typography color="error" align="center" variant="body2">{error}</Typography>}
        </form>
        <Typography align="center" variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          Test credentials: user@mail.com / password
        </Typography>
      </Card>
    </Box>
  );
};

export default Login;
