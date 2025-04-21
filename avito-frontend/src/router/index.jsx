// src/router/index.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import BoardsPage       from '../pages/BoardsPage';
import BoardDetailPage  from '../pages/BoardDetailPage';
import IssuesPage       from '../pages/IssuesPage';

import Layout from '../components/Layout';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/boards"
          element={
            <Layout>
              <BoardsPage />
            </Layout>
          }
        />
        <Route
          path="/board/:id"
          element={
            <Layout>
              <BoardDetailPage />
            </Layout>
          }
        />
        <Route
          path="/issues"
          element={
            <Layout>
              <IssuesPage />
            </Layout>
          }
        />
        <Route
          path="*"
          element={
            <Layout>
              <BoardsPage />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
