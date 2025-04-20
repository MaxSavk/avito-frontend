import { api } from "./index.js";

export function fetchBoards() {
    return api.get("/boards");
}
