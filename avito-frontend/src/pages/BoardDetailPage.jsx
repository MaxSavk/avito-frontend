import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import {
    Box,
    Typography,
    Button,
    Paper,
    CircularProgress,
    Stack,
} from "@mui/material";

import { fetchBoardTasks } from "../api/boards";
import { updateTaskStatus } from "../api/tasks";
import TaskModal from "../components/TaskModal";

const STATUSES = ["Backlog", "InProgress", "Done"];

export default function BoardDetailPage() {
    const { id } = useParams();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState({});

    const loadTasks = () => {
        setLoading(true);
        fetchBoardTasks(id)
            .then((res) => setTasks(res.data.data))
            .finally(() => setLoading(false));
    };
    useEffect(loadTasks, [id]);

    const onDragEnd = async ({ source, destination, draggableId }) => {
        if (!destination || destination.droppableId === source.droppableId)
            return;

        const taskId = Number(draggableId);
        const newStatus = destination.droppableId;

        try {
            await updateTaskStatus(taskId, newStatus);
            setTasks((ts) =>
                ts.map((t) =>
                    t.id === taskId ? { ...t, status: newStatus } : t
                )
            );
        } catch (err) {
            console.error(err);
            alert("Не удалось обновить статус");
        }
    };

    const tasksByStatus = useMemo(
        () =>
            STATUSES.reduce((acc, s) => {
                acc[s] = tasks.filter((t) => t.status === s);
                return acc;
            }, {}),
        [tasks]
    );

    if (loading)
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
                <CircularProgress />
            </Box>
        );

    return (
        <>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Typography variant="h4">Доска {id}</Typography>

                <Button
                    variant="contained"
                    startIcon={
                        <Box
                            component="span"
                            sx={{ fontSize: 20, lineHeight: 1 }}
                        >
                            +
                        </Box>
                    }
                    onClick={() => {
                        setEditData({ boardId: Number(id) });
                        setModalOpen(true);
                    }}
                >
                    Создать задачу
                </Button>
            </Stack>

            <DragDropContext onDragEnd={onDragEnd}>
                <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 1 }}>
                    {STATUSES.map((status) => (
                        <Droppable key={status} droppableId={status}>
                            {(provided) => (
                                <Paper
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    sx={{
                                        width: 260,
                                        p: 2,
                                        flexShrink: 0,
                                        bgcolor: "grey.50",
                                    }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        sx={{ fontWeight: "bold", mb: 1 }}
                                    >
                                        {status}
                                    </Typography>

                                    {tasksByStatus[status].map((t, index) => (
                                        <Draggable
                                            key={t.id}
                                            draggableId={String(t.id)}
                                            index={index}
                                        >
                                            {(p) => (
                                                <Paper
                                                    ref={p.innerRef}
                                                    {...p.draggableProps}
                                                    {...p.dragHandleProps}
                                                    elevation={1}
                                                    sx={{
                                                        p: 1.5,
                                                        mb: 1,
                                                        borderRadius: 1,
                                                        backgroundColor: "#fff",
                                                        cursor: "pointer",
                                                        transition:
                                                            "box-shadow 0.2s",
                                                        ...(p.isDragging && {
                                                            boxShadow: 6,
                                                            backgroundColor:
                                                                "#f0f0f0",
                                                        }),
                                                    }}
                                                    onClick={() => {
                                                        setEditData({
                                                            id: t.id,
                                                            title: t.title,
                                                            description:
                                                                t.description,
                                                            priority:
                                                                t.priority,
                                                            status: t.status,
                                                            assigneeId:
                                                                t.assignee.id,
                                                            boardId: Number(id),
                                                        });
                                                        setModalOpen(true);
                                                    }}
                                                >
                                                    <Typography variant="body2">
                                                        {t.title}
                                                    </Typography>
                                                </Paper>
                                            )}
                                        </Draggable>
                                    ))}

                                    {provided.placeholder}
                                </Paper>
                            )}
                        </Droppable>
                    ))}
                </Box>
            </DragDropContext>

            <TaskModal
                isOpen={isModalOpen}
                initialData={editData}
                onClose={(didChange) => {
                    setModalOpen(false);
                    if (didChange) loadTasks();
                }}
            />
        </>
    );
}
