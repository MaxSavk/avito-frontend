import { BrowserRouter, Routes, Route } from "react-router-dom";
import BoardsPage from "../pages/BoardsPage";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/boards" element={<BoardsPage />} />
                <Route path="*" element={<BoardsPage />} />
            </Routes>
        </BrowserRouter>
    );
}
