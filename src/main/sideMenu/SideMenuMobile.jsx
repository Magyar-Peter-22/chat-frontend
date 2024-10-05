import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import * as React from 'react';
import MenuContents from './MenuContents';

export default function SwipeableTemporaryDrawer() {
  const [open, setOpen] = React.useState(false);

  const handleOpen = React.useCallback((value) => {
    return () => { setOpen(value) };
  })

  return (
    <>
      <IconButton onClick={handleOpen(true)}
        aria-label="open menu"
        aria-haspopup="true"
        aria-controls={open ? 'settings' : undefined}
        aria-expanded={open ? 'true' : undefined}
      >
        <MenuIcon />
      </IconButton>

      <SwipeableDrawer
        anchor="left"
        open={open}
        onClose={handleOpen(false)}
        onOpen={handleOpen(true)}
        onClick={handleOpen(false)}

      >
        <MenuContents />
      </SwipeableDrawer>
    </>
  );
}