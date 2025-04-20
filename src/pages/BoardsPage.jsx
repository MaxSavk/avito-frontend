import React, { useEffect, useState } from "react";
import { fetchBoards } from "../api/boards.js";
import Header from "../components/Header";

export default function BoardsPage() {
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBoards()
            .then((res) => {
                setBoards(res.data.data); // <-- вот сюда берём именно res.data.data
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Загрузка...</p>;

    return (
        <>
            <Header />
            <div style={{ padding: 20 }}>
                <h1>Доски</h1>
                <ul>
                    {boards.map((b) => (
                        <li key={b.id}>
                            <a href={`/board/${b.id}`}>
                                {b.name} ({b.taskCount})
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
