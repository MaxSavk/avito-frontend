import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBoardTasks } from '../api/boards.js';
import Header from '../components/Header.jsx';
import TaskModal from '../components/TaskModal.jsx';

export default function BoardDetailPage() {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState({});

  const loadTasks = () => {
    setLoading(true);
    fetchBoardTasks(id)
      .then(res => setTasks(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTasks();
  }, [id]);

  if (loading) return <p>Загрузка задач…</p>;

  return (
    <>
      <Header />

      <div style={{ padding: 20 }}>
        <h1>Задачи доски {id}</h1>

        <button
          style={{ marginBottom: 16 }}
          onClick={() => {
            setEditData({ boardId: Number(id) });
            setModalOpen(true);
          }}
        >
          Создать задачу
        </button>

        {tasks.length ? (
          <ul>
            {tasks.map(t => (
              <li
                key={t.id}
                style={{ cursor: 'pointer', marginBottom: 8 }}
                onClick={() => {
                  setEditData({ ...t, boardId: Number(id) });
                  setModalOpen(true);
                }}
              >
                {t.title} — {t.status}
              </li>
            ))}
          </ul>
        ) : (
          <p>Нет задач.</p>
        )}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        initialData={editData}
        onClose={shouldReload => {
          setModalOpen(false);
          if (shouldReload) {
            loadTasks();
          }
        }}
      />
    </>
  );
}
