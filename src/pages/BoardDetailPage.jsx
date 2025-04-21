// src/pages/BoardDetailPage.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchBoardTasks } from "../api/boards";
import Header from "../components/Header.jsx";
import TaskModal from "../components/TaskModal.jsx";

export default function BoardDetailPage() {
    const { id } = useParams();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState({});

    const loadTasks = () => {
        setLoading(true);
        fetchBoardTasks(id)
            .then((res) => {
                // API отдаёт { data: Array(...) }
                setTasks(res.data.data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(loadTasks, [id]);

    if (loading) return <p>Загрузка задач…</p>;

    return (
        <>
            <Header />

            <div style={{ padding: 20 }}>
                <h1>Задачи доски {id}</h1>

                <button
                    onClick={() => {
                        setEditData({ boardId: Number(id) });
                        setModalOpen(true);
                    }}
                >
                    Создать задачу
                </button>

                <ul>
                    {tasks.map((t) => (
                        <li key={t.id}>
                            <span
                                style={{
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                }}
                                onClick={() => {
                                    setEditData({
                                        id: t.id,
                                        title: t.title,
                                        description: t.description,
                                        priority: t.priority,
                                        status: t.status,
                                        assigneeId: t.assignee.id,
                                        boardId: Number(id),
                                    });
                                    setModalOpen(true);
                                }}
                            >
                                {t.title} — {t.status}
                            </span>
                        </li>
                    ))}
                </ul>
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
