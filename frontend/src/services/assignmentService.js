import api from './api.js';

export async function getAssignments() {
  const { data } = await api.get('/assignments');
  return data.assignments || [];
}

export async function createAssignment(payload) {
  const { data } = await api.post('/assignments', payload);
  return data.assignment;
}
