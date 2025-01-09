import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

export default function Sidebar({ topics, selectedModule, setSelectedModule }) {
  return (
    <List sx={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '8px' }}>
      {topics.map((module) => (
        <ListItem
          button
          key={module.moduleTitle}
          selected={module.moduleTitle === selectedModule?.moduleTitle}
          onClick={() => setSelectedModule(module)} // Pass entire module object
          sx={{
            backgroundColor: module.moduleTitle === selectedModule?.moduleTitle ? '#3f51b5' : 'transparent',
            color: module.moduleTitle === selectedModule?.moduleTitle ? '#fff' : '#000',
            marginBottom: '5px',
            borderRadius: '4px',
          }}
        >
          <ListItemText primary={module.moduleTitle} />
        </ListItem>
      ))}
    </List>
  );
}
