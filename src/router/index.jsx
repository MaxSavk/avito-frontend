import { BrowserRouter, Routes, Route } from "react-router-dom";

import BoardsPage from "../pages/BoardsPage";
import BoardDetailPage from '../pages/BoardDetailPage';

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/boards" element={<BoardsPage />} />
                <Route path="/board/:id" element={<BoardDetailPage />} />
                <Route path="*" element={<BoardsPage />} />
            </Routes>
        </BrowserRouter>
    );
}
