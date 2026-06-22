import api from './api.js';

export async function createSubmission(payload) {
  const { data } = await api.post('/submissions', payload);
  return data.submission;
}
