'use client'

import { useAuth } from '@/hooks/use-auth'
import { useTheme } from '@/providers/theme-provider'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import HomeIcon from '@mui/icons-material/Home'
import LightModeIcon from '@mui/icons-material/LightMode'
import SignInIcon from '@mui/icons-material/Login'
import SignOutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import {
  AppBar,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from '@mui/material'
import Link from 'next/link'
import { useState } from 'react'

export default function AppNav() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { toggleTheme, mode } = useTheme();
  const { user, isLoading, logout } = useAuth();

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Next Boilerplate
        </Typography>

        <IconButton color="inherit" onClick={handleMenuOpen}>
          <MenuIcon />
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem
            onClick={handleMenuClose}
            component={Link}
            href="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <ListItemIcon>
              <HomeIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </MenuItem>

          <MenuItem onClick={toggleTheme}>
            <ListItemIcon>
              {mode === 'light' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
            </ListItemIcon>
            <ListItemText primary={mode === 'light' ? 'Dark Mode' : 'Light Mode'} />
          </MenuItem>

          {!isLoading && user ? (
            <MenuItem
              onClick={logout}
              component={Link}
              href="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <ListItemIcon>
                <SignOutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Sign Out" />
            </MenuItem>
          ) : (
            <MenuItem
              onClick={handleMenuClose}
              component={Link}
              href="/sign-in"
              sx={{
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <ListItemIcon>
                <SignInIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Sign In" />
            </MenuItem>
          )}
        </Menu>

      </Toolbar>
    </AppBar>
  );
}
