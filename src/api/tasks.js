import { api } from './index.js';

export const fetchAllTasks = () => api.get('/tasks');
