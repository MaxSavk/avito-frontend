// src/pages/BoardsPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { fetchBoards } from '../api/boards.js';

import {
  Box,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Typography,
} from '@mui/material';

export default function BoardsPage() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoards()
      .then((res) => setBoards(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Доски
      </Typography>

      {boards.length ? (
        <List disablePadding>
          {boards.map((b) => (
            <ListItemButton
              key={b.id}
              component={Link}
              to={`/board/${b.id}`}
              sx={{ borderRadius: 1, mb: 1 }}
            >
              <ListItemText
                primary={b.name}
                secondary={`Задач: ${b.taskCount}`}
              />
            </ListItemButton>
          ))}
        </List>
      ) : (
        <Typography>Нет доступных досок.</Typography>
      )}
    </Paper>
  );
}
