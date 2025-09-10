import * as React from 'react';
import { Popover, List, ListItemButton, ListItemText, Divider } from '@mui/material';

export default function LeadActionMenu({ anchorEl, open, onClose, onView, onEdit, onDelete }) {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{ sx: { width: 200 } }}
    >
      <List dense disablePadding>
        <ListItemButton onClick={onView}>
          <ListItemText primary="View" />
        </ListItemButton>
        <ListItemButton onClick={onEdit}>
          <ListItemText primary="Edit" />
        </ListItemButton>
        <Divider />
        <ListItemButton sx={{ color: 'error.main' }} onClick={onDelete}>
          <ListItemText primary="Delete" />
        </ListItemButton>
      </List>
    </Popover>
  );
}
