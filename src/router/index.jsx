import { BrowserRouter, Routes, Route } from "react-router-dom";

import BoardsPage from "../pages/BoardsPage";
import BoardDetailPage from '../pages/BoardDetailPage';
import IssuesPage from '../pages/IssuesPage';

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/boards" element={<BoardsPage />} />
                <Route path="/board/:id" element={<BoardDetailPage />} />
                <Route path="/issues" element={<IssuesPage />} />
                <Route path="*" element={<BoardsPage />} />
            </Routes>
        </BrowserRouter>
    );
}
