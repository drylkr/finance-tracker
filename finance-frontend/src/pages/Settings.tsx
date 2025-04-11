import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  TextField, 
  Button, 
  Avatar, 
  IconButton, 
  Divider, 
  CircularProgress,
  Alert,
  AlertTitle
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const Settings: React.FC = () => {
  // Mock user data - replace with actual user data from your auth state
  const [user, setUser] = useState({
    email: "john.doe@example.com",
    password: "••••••••", // Masked password
    name: "John Doe",
    photoURL: "/api/placeholder/120/120" // Placeholder image
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Handle file selection for avatar
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      // In a real app, you would upload this to Firebase Storage
      // For now, we'll just create a local URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUser({
            ...user,
            photoURL: e.target.result as string
          });
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  // Simulate save operation
  const handleSave = () => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  return (
    <Box sx={{ mx: 'auto', pb: 8, maxWidth: '1000px' }}>
      <Box my={4}>
        <Typography variant="h4" fontWeight="bold">
          Account Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage your account information
        </Typography>
      </Box>

      {/* Preview Alert */}
      <Alert 
        severity="info" 
        sx={{ mb: 4 }}
        icon={<InfoOutlinedIcon />}
      >
        <AlertTitle>Preview Mode</AlertTitle>
        This is a preview of the settings page. Form fields are disabled for demonstration purposes.
      </Alert>

      {/* Success Message */}
      {success && (
        <Alert 
          severity="success" 
          sx={{ mb: 4 }}
        >
          Settings updated successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Picture Section */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, alignSelf: 'flex-start' }}>
              Profile Picture
            </Typography>
            
            <Box sx={{ position: 'relative', mb: 3 }}>
              <Avatar 
                src={user.photoURL} 
                sx={{ width: 150, height: 150, mb: 2 }}
                alt={user.name}
              />
              <IconButton 
                sx={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  right: 0, 
                  backgroundColor: 'primary.main',
                  '&:hover': { backgroundColor: 'primary.dark' },
                  color: 'white'
                }}
                component="label"
              >
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleFileSelect}
                />
                <PhotoCameraIcon />
              </IconButton>
            </Box>
            
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
              Upload a new profile picture. Recommended size: 200x200px.
            </Typography>
          </Card>
        </Grid>

        {/* Account Information Section */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Account Information
            </Typography>

            <Grid container spacing={3}>
              {/* Name Field */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <PersonOutlineOutlinedIcon sx={{ mt: 1, mr: 2, color: 'text.secondary' }} />
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Full Name
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={user.name}
                      disabled
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'rgba(0, 0, 0, 0.1)',
                          },
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Grid>

              {/* Email Field */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <EmailOutlinedIcon sx={{ mt: 1, mr: 2, color: 'text.secondary' }} />
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Email Address
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={user.email}
                      disabled
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'rgba(0, 0, 0, 0.1)',
                          },
                        },
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Your email address is used for login and notifications.
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Password Field */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <LockOutlinedIcon sx={{ mt: 1, mr: 2, color: 'text.secondary' }} />
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Password
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="password"
                      value={user.password}
                      disabled
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'rgba(0, 0, 0, 0.1)',
                          },
                        },
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Choose a strong password with at least 8 characters.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Action Buttons */}
            <Box display="flex" justifyContent="flex-end">
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSave}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                sx={{ minWidth: 120 }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Additional Settings Card */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, mt: 1 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Danger Zone
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Permanently delete your account and all associated data.
              </Typography>
            </Box>
            <Button 
              variant="outlined" 
              color="error"
              disabled
            >
              Delete Account
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;