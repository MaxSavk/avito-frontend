import React, { useState, useEffect } from "react";
import { api } from "../api/index.js";
import "./TaskModal.css";

export default function TaskModal({
  isOpen,
  onClose,
  initialData = {},
  showBoardLink = false,
  onGoToBoard,
}) {
  const isEdit = Boolean(initialData.id);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Backlog",
    boardId: initialData.boardId || "",
    assigneeId: initialData.assigneeId || "",
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    api
      .get("/users")
      .then((res) => setUsers(res.data.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setForm({
      title: initialData.title || "",
      description: initialData.description || "",
      priority: initialData.priority || "Medium",
      status: initialData.status || "Backlog",
      boardId: initialData.boardId || "",
      assigneeId: initialData.assigneeId || "",
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.boardId || !form.assigneeId) {
      return alert("Заполните название, доску и исполнителя");
    }

    const payload = {
      title: form.title,
      description: form.description,
      priority: form.priority,
      assigneeId: Number(form.assigneeId),
      boardId: Number(form.boardId),
      ...(isEdit && { status: form.status }),
    };

    try {
      if (isEdit) {
        await api.put(`/tasks/update/${initialData.id}`, payload);
      } else {
        await api.post("/tasks/create", payload);
      }
      onClose(true);
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Ошибка: " + (err.response?.data?.message || err.message));
    }
  };

  if (!isOpen) return null;
  return (
    <div className="modal-backdrop" onClick={() => onClose(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{isEdit ? "Редактировать задачу" : "Создать задачу"}</h2>

        <label>
          Название
          <input name="title" value={form.title} onChange={handleChange} />
        </label>

        <label>
          Описание
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </label>

        <label>
          Приоритет
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>

        {isEdit && (
          <label>
            Статус
            <select name="status" value={form.status} onChange={handleChange}>
              <option>Backlog</option>
              <option>InProgress</option>
              <option>Done</option>
            </select>
          </label>
        )}

        <label>
          Исполнитель
          <select
            name="assigneeId"
            value={form.assigneeId}
            onChange={handleChange}
          >
            <option value="">— не выбран —</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.fullName}
              </option>
            ))}
          </select>
        </label>

        <p>Доска: {form.boardId}</p>

        <div className="modal-actions">
          {showBoardLink && typeof onGoToBoard === "function" && (
            <button
              type="button"
              onClick={() => {
                onClose(false);
                onGoToBoard();
              }}
            >
              Перейти на доску
            </button>
          )}
          <button onClick={() => onClose(false)}>Отмена</button>
          <button onClick={handleSubmit}>
            {isEdit ? "Сохранить" : "Создать"}
          </button>
        </div>
      </div>
    </div>
  );
}
