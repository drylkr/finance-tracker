import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Alert,
  CircularProgress,
  Link as MuiLink,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { register, clearError } from '../../store/authSlice';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState({ email: '', password: '', confirmPassword: '' });
  const [success, setSuccess] = useState(false);
  
  const { isLoading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const validateForm = (): boolean => {
    let valid = true;
    const errors = { email: '', password: '', confirmPassword: '' };

    if (!email.trim()) {
        errors.email = 'Email is required';
        valid = false;
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = 'Email is invalid';
        valid = false;
      }
  
      if (!password) {
        errors.password = 'Password is required';
        valid = false;
      } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
        valid = false;
      }
  
      if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
        valid = false;
      }
  
      setFormErrors(errors);
      return valid;
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (validateForm()) {
        try {
          await dispatch(register({ email, password })).unwrap();
          setSuccess(true);
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } catch (err) {
          // Error is handled by the reducer
        }
      }
    };
  
    return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
            <Typography component="h1" variant="h5" align="center" gutterBottom>
              Finance Tracker
            </Typography>
            <Typography component="h2" variant="h6" align="center" sx={{ mb: 3 }}>
              Create Account
            </Typography>
  
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>Registration successful! Redirecting to login...</Alert>}
  
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!formErrors.email}
                helperText={formErrors.email}
                disabled={isLoading || success}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!formErrors.password}
                helperText={formErrors.password}
                disabled={isLoading || success}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
                disabled={isLoading || success}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading || success}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <MuiLink component={Link} to="/login" variant="body2">
                  {"Already have an account? Sign In"}
                </MuiLink>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  };
  
export default Register;