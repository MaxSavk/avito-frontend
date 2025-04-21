import { useEffect, useState } from 'react';
import { fetchBoards } from '../api/boards';
import {
  Typography,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import { Link } from 'react-router-dom';

export default function BoardsPage() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoards()
      .then((res) => setBoards(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Paper>
    );

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Доски
      </Typography>

      <Paper elevation={1}>
        <List disablePadding>
          {boards.map((b) => (
            <ListItemButton
              key={b.id}
              component={Link}
              to={`/board/${b.id}`}
            >
              <ListItemText
                primary={b.name}
                secondary={`Задач: ${b.taskCount}`}
              />
            </ListItemButton>
          ))}
        </List>
      </Paper>
    </>
  );
}
