import React, { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../store/authSlice";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Divider,
  IconButton,
  ListItemIcon,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItemButton,
  ListItemText
} from "@mui/material";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuIcon from "@mui/icons-material/Menu";
// import coin from "../../../public/coin.svg"

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  // Profile menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  // Mobile drawer state
  const [mobileOpen, setMobileOpen] = useState(false);

  // Mock user data - replace with actual user data from auth state
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/api/placeholder/40/40" // Placeholder image
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    handleClose();
    navigate("/login");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (mobileOpen) setMobileOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { text: "Home", path: "/dashboard" },
    { text: "Transactions", path: "/transactions" },
  ];

  // Mobile drawer content
  const drawer = (
    <Box onClick={() => setMobileOpen(false)} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Finance App
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            sx={{
              backgroundColor: isActive(item.path) ? "#f4f4f4" : "transparent",
              "&:hover": { backgroundColor: "#f0f0f0" },
            }}
          >
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="static" 
        color="default" 
        elevation={0}
        sx={{ 
          backgroundColor: "#fff",
          zIndex: theme.zIndex.drawer + 1, 
          // border: "1px solid lightgray"
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: isMobile ? 'space-between' : 'flex-start' }}>
          {/* Mobile menu button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo or Brand */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 0, mr: 2, display: { xs: 'none', sm: 'block' } }}
          >
            Finance App
          </Typography>

          {/* Navigation links */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}>
            {navItems.map((item) => (
              <Button
                key={item.text}
                onClick={() => handleNavigation(item.path)}
                sx={{ 
                  color: 'inherit',
                  backgroundColor: isActive(item.path) ? "#f4f4f4" : "transparent",
                  mx: 1,
                  "&:hover": { backgroundColor: "#f0f0f0" },
                  borderRadius: "4px",
                  px: 2
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>

          {/* Profile Avatar with dropdown */}
          <Box sx={{ flexGrow: 0, ml: isMobile ? '0' : 'auto' }}>
            <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
              <Avatar 
                alt={user.name} 
                src={user.avatar} 
                sx={{ width: 40, height: 40 }}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                  mt: 1.5,
                  minWidth: 200,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {/* User profile section */}
              <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center' }}>
                <Avatar src={user.avatar} sx={{ width: 40, height: 40 }} />
                <Box sx={{ ml: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                    {user.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                    {user.email}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 1 }} />
              
              {/* Settings option */}
              <MenuItem onClick={() => handleNavigation('/settings')}>
                <ListItemIcon>
                  <SettingsOutlinedIcon fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              
              {/* Logout option */}
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutOutlinedIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true, 
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;