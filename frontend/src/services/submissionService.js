import api from './api.js';

export async function createSubmission(payload) {
  const { data } = await api.post('/submissions', payload);
  return data.submission;
}

export async function getAssignmentSubmissions(assignmentId) {
  const { data } = await api.get(
    `/assignments/${assignmentId}/submissions`
  );

  return data.submissions;
}