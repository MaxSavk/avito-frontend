import { api } from "./index.js";

export function fetchBoards() {
  return api.get("/boards");
}

export function fetchBoardTasks(boardId) {
  return api.get(`/boards/${boardId}`);
}
