import { api } from "./index.js";

export function fetchBoards() {
    return api.get("/boards");
}

export const fetchBoardTasks = (boardId) =>
  api.get(`/boards/${boardId}`);
