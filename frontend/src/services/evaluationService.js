import api from './api.js';

export async function createEvaluation(submissionId) {
  const { data } = await api.post(`/evaluations/${submissionId}`);
  return data.evaluation;
}

export async function getEvaluation(submissionId) {
  const { data } = await api.get(`/evaluations/${submissionId}`);
  return data.evaluation;
}
