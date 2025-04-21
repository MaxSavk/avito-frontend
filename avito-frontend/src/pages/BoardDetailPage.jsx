import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import Header from "../components/Header.jsx";
import TaskModal from "../components/TaskModal.jsx";

import { fetchBoardTasks } from "../api/boards.js";
import { updateTaskStatus } from "../api/tasks.js";

import "./BoardDetailPage.css";

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
            .catch(console.error)
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

    if (loading) return <p>Загрузка задач…</p>;

    const tasksByStatus = STATUSES.reduce((acc, status) => {
        acc[status] = tasks.filter((t) => t.status === status);
        return acc;
    }, {});

    return (
        <>
            <Header />
            <div className="board-detail">
                <h1>Задачи доски {id}</h1>
                <button
                    onClick={() => {
                        setEditData({ boardId: Number(id) });
                        setModalOpen(true);
                    }}
                >
                    Создать задачу
                </button>

                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="board-columns">
                        {STATUSES.map((status) => (
                            <Droppable key={status} droppableId={status}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="board-column"
                                    >
                                        <h3 className="column-title">
                                            {status}
                                        </h3>
                                        {tasksByStatus[status].map(
                                            (t, index) => (
                                                <Draggable
                                                    key={t.id}
                                                    draggableId={String(t.id)}
                                                    index={index}
                                                >
                                                    {(p) => (
                                                        <div
                                                            ref={p.innerRef}
                                                            {...p.draggableProps}
                                                            {...p.dragHandleProps}
                                                            className="task-card"
                                                            style={p.draggableProps.style}
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
                                                                        t
                                                                            .assignee
                                                                            .id,
                                                                    boardId:
                                                                        Number(
                                                                            id
                                                                        ),
                                                                });
                                                                setModalOpen(
                                                                    true
                                                                );
                                                            }}
                                                        >
                                                            {t.title}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            )
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                </DragDropContext>
            </div>

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
