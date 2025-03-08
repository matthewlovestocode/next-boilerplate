'use client'

import { useTheme } from '@/providers/theme-provider'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import MenuIcon from '@mui/icons-material/Menu'
import { AppBar, IconButton, ListItemIcon, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import { useState } from 'react'

export default function AppNav() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { toggleTheme, mode } = useTheme();

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
          <MenuItem onClick={toggleTheme}>
            <ListItemIcon>
              {mode === 'light' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
            </ListItemIcon>
            {mode === 'light' ? 'Dark Theme' : 'Light Theme'}
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
