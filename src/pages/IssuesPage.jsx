import React, { useEffect, useState } from "react";
import { fetchAllTasks } from "../api/tasks";
import Header from "../components/Header";
import { Link } from "react-router-dom";

export default function IssuesPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filterStatus, setFilterStatus] = useState("");
    const [filterBoard, setFilterBoard] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchAllTasks()
            .then((res) => setTasks(res.data.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Загрузка всех задач…</p>;

    const visible = tasks
        .filter((t) => !filterStatus || t.status === filterStatus)
        .filter((t) => !filterBoard || String(t.boardId) === filterBoard)
        .filter(
            (t) =>
                !search || t.title.toLowerCase().includes(search.toLowerCase())
        );

    return (
        <>
            <Header />
            <div style={{ padding: 20 }}>
                <h1>Все задачи</h1>

                <div style={{ marginBottom: 16 }}>
                    <input
                        placeholder="Поиск по названию…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ marginRight: 8 }}
                    />

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{ marginRight: 8 }}
                    >
                        <option value="">— Все статусы —</option>
                        <option>Backlog</option>
                        <option>InProgress</option>
                        <option>Done</option>
                    </select>

                    <select
                        value={filterBoard}
                        onChange={(e) => setFilterBoard(e.target.value)}
                    >
                        <option value="">— Все доски —</option>
                        {[...new Set(tasks.map((t) => t.boardId))]
                            .map((id) => {
                                const name = tasks.find(
                                    (t) => t.boardId === id
                                )?.boardName;
                                return { id, name };
                            })
                            .map((b) => (
                                <option key={b.id} value={String(b.id)}>
                                    {b.name}
                                </option>
                            ))}
                    </select>
                </div>

                {visible.length ? (
                    <ul>
                        {visible.map((t) => (
                            <li key={t.id} style={{ marginBottom: 8 }}>
                                <Link to={`/board/${t.boardId}`}>
                                    {t.title} — {t.status} (Доска: {t.boardName}
                                    )
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Ничего не найдено.</p>
                )}
            </div>
        </>
    );
}
