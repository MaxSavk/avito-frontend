import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import {
  Box,
  Stack,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  CircularProgress,
} from '@mui/material';

import { fetchAllTasks } from '../api/tasks';
import { api } from '../api';
import TaskModal from '../components/TaskModal';

export default function IssuesPage() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = () =>
    fetchAllTasks()
      .then((res) => setTasks(res.data.data))
      .catch(console.error);

  useEffect(() => {
    Promise.all([
      loadTasks(),
      api.get('/users').then((res) => setUsers(res.data.data)),
    ]).finally(() => setLoading(false));
  }, []);

  const [filterStatus, setFilterStatus] = useState('');
  const [filterBoard, setFilterBoard] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');
  const [search, setSearch] = useState('');

  const [isModalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState({});

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const paramTaskId = searchParams.get('task');

  useEffect(() => {
    if (!loading && paramTaskId) {
      const t = tasks.find((x) => String(x.id) === paramTaskId);
      if (t) {
        setEditData({
          id: t.id,
          title: t.title,
          description: t.description,
          priority: t.priority,
          status: t.status,
          assigneeId: t.assignee.id,
          boardId: t.boardId,
        });
        setModalOpen(true);
      }
    }
  }, [loading, tasks, paramTaskId]);

  const visible = useMemo(
    () =>
      tasks
        .filter((t) => !filterStatus || t.status === filterStatus)
        .filter((t) => !filterBoard || String(t.boardId) === filterBoard)
        .filter(
          (t) => !filterAssignee || String(t.assignee.id) === filterAssignee,
        )
        .filter((t) =>
          search
            ? t.title.toLowerCase().includes(search.toLowerCase())
            : true,
        ),
    [tasks, filterStatus, filterBoard, filterAssignee, search],
  );

  const boardOptions = [
    ...new Map(tasks.map((t) => [t.boardId, t.boardName])).entries(),
  ];

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Все задачи
      </Typography>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <TextField
          label="Поиск по названию"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />

        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel>Статус</InputLabel>
          <Select
            label="Статус"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="">Все</MenuItem>
            <MenuItem value="Backlog">Backlog</MenuItem>
            <MenuItem value="InProgress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel>Доска</InputLabel>
          <Select
            label="Доска"
            value={filterBoard}
            onChange={(e) => setFilterBoard(e.target.value)}
          >
            <MenuItem value="">Все</MenuItem>
            {boardOptions.map(([id, name]) => (
              <MenuItem key={id} value={String(id)}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Исполнитель</InputLabel>
          <Select
            label="Исполнитель"
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
          >
            <MenuItem value="">Все</MenuItem>
            {users.map((u) => (
              <MenuItem key={u.id} value={String(u.id)}>
                {u.fullName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {visible.length ? (
        <Paper>
          <List disablePadding>
            {visible.map((t) => (
              <ListItemButton
                key={t.id}
                onClick={() => {
                  setEditData({
                    id: t.id,
                    title: t.title,
                    description: t.description,
                    priority: t.priority,
                    status: t.status,
                    assigneeId: t.assignee.id,
                    boardId: t.boardId,
                  });
                  setModalOpen(true);
                  setSearchParams({ task: String(t.id) });
                }}
              >
                <ListItemText
                  primary={t.title}
                  secondary={`${t.status} • доска: ${t.boardName}`}
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      ) : (
        <Typography color="text.secondary">Ничего не найдено.</Typography>
      )}

      <TaskModal
        isOpen={isModalOpen}
        initialData={editData}
        showBoardLink
        onGoToBoard={() =>
          navigate(`/board/${editData.boardId}?task=${editData.id}`)
        }
        onClose={(didChange) => {
          setModalOpen(false);
          setSearchParams({});
          if (didChange) loadTasks();
        }}
      />
    </>
  );
}
