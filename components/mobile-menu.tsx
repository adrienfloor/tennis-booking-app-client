import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { GiHamburgerMenu } from 'react-icons/gi'
import Link from 'next/link'

import styles from '../styles/Home.module.css'

type Anchor = 'left'

export default function MobileMenu({ isAdmin, onLogout }: any) {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: 300 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <Link href='/'>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText>Réservation</ListItemText>
            </ListItemButton>
          </ListItem>
        </Link>
        {
          isAdmin &&
          <Link href='/admin'>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText>Admin</ListItemText>
              </ListItemButton>
            </ListItem>
          </Link>
        }
        <Link href='/profile'>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText>Mon compte</ListItemText>
            </ListItemButton>
          </ListItem>
        </Link>
        <button
          className={styles.logoutButton}
          onClick={onLogout}
        >
          Déconnexion
        </button>
      </List>
    </Box>
  );

  return (
    <div>
      {(['left'] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>
            <GiHamburgerMenu size='30px' color='white' />
          </Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}