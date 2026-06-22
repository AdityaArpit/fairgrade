import {
  createEvaluationForSubmission,
  findEvaluationForSubmission
} from '../services/evaluation.service.js';

function handleControllerError(res, error, fallbackMessage) {
  return res.status(error.statusCode || 500).json({
    message: error.message || fallbackMessage
  });
}

export async function createEvaluation(req, res) {
  try {
    const evaluation = await createEvaluationForSubmission(
      req.params.submissionId,
      req.user.id
    );
    return res.status(201).json({ evaluation });
  } catch (error) {
    return handleControllerError(res, error, 'Unable to create evaluation');
  }
}

export async function getEvaluation(req, res) {
  try {
    const evaluation = await findEvaluationForSubmission(
      req.params.submissionId,
      req.user
    );
    return res.json({ evaluation });
  } catch (error) {
    return handleControllerError(res, error, 'Unable to fetch evaluation');
  }
}
