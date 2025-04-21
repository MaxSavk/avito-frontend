import React, { useEffect, useState } from "react";
import { fetchAllTasks } from "../api/tasks";
import Header from "../components/Header";
import TaskModal from "../components/TaskModal";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../api/index.js";

export default function IssuesPage() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState("");
  const [filterBoard, setFilterBoard] = useState("");
  const [filterAssignee, setFilterAssignee] = useState("");
  const [search, setSearch] = useState("");

  const [isModalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState({});

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const paramTaskId = searchParams.get("task");

  // 1) Загружаем все задачи
  useEffect(() => {
    fetchAllTasks()
      .then((res) => setTasks(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // 2) Загружаем список пользователей для фильтра
  useEffect(() => {
    api
      .get("/users")
      .then((res) => setUsers(res.data.data))
      .catch(console.error);
  }, []);

  // 3) Открываем модалку по ?task=
  useEffect(() => {
    if (!loading && paramTaskId) {
      const t = tasks.find((t) => String(t.id) === paramTaskId);
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

  if (loading) return <p>Загрузка всех задач…</p>;

  // 4) Применяем все фильтры
  const visible = tasks
    .filter((t) => !filterStatus || t.status === filterStatus)
    .filter((t) => !filterBoard || String(t.boardId) === filterBoard)
    .filter(
      (t) => !filterAssignee || String(t.assignee.id) === filterAssignee
    )
    .filter((t) =>
      !search ? true : t.title.toLowerCase().includes(search.toLowerCase())
    );

  const handleTaskClick = (t) => {
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
  };

  return (
    <>
      <Header />
      <div style={{ padding: 20 }}>
        <h1>Все задачи</h1>

        <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
          <input
            placeholder="Поиск по названию…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
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
                const name = tasks.find((t) => t.boardId === id)?.boardName;
                return { id, name };
              })
              .map((b) => (
                <option key={b.id} value={String(b.id)}>
                  {b.name}
                </option>
              ))}
          </select>

          {/* Новый фильтр по исполнителю */}
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
          >
            <option value="">— Все исполнители —</option>
            {users.map((u) => (
              <option key={u.id} value={String(u.id)}>
                {u.fullName}
              </option>
            ))}
          </select>
        </div>

        {visible.length ? (
          <ul>
            {visible.map((t) => (
              <li
                key={t.id}
                style={{ marginBottom: 8, cursor: "pointer" }}
                onClick={() => handleTaskClick(t)}
              >
                {t.title} — {t.status} (Доска: {t.boardName})
              </li>
            ))}
          </ul>
        ) : (
          <p>Ничего не найдено.</p>
        )}

        <TaskModal
          isOpen={isModalOpen}
          initialData={editData}
          showBoardLink={true}
          onGoToBoard={() => {
            navigate(
              `/board/${editData.boardId}?task=${editData.id}`
            );
          }}
          onClose={(didChange) => {
            setModalOpen(false);
            setSearchParams({});
            if (didChange) {
              fetchAllTasks()
                .then((res) => setTasks(res.data.data))
                .catch(console.error);
            }
          }}
        />
      </div>
    </>
  );
}
