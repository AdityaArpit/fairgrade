import {
  createSubmissionForStudent,
  findSubmissionsByStudent,
  findSubmissionsForTeacherAssignment
} from '../services/submission.service.js';

function handleControllerError(res, error, fallbackMessage) {
  return res.status(error.statusCode || 500).json({
    message: error.message || fallbackMessage
  });
}

export async function createSubmission(req, res) {
  try {
    const submission = await createSubmissionForStudent(req.user.id, req.body);
    return res.status(201).json({ submission });
  } catch (error) {
    return handleControllerError(res, error, 'Unable to create submission');
  }
}

export async function getMySubmissions(req, res) {
  try {
    const submissions = await findSubmissionsByStudent(req.user.id);
    return res.json({ submissions });
  } catch (error) {
    return handleControllerError(res, error, 'Unable to fetch submissions');
  }
}

export async function getSubmissionsForAssignment(req, res) {
  try {
    const submissions = await findSubmissionsForTeacherAssignment(
      req.params.id,
      req.user.id
    );
    return res.json({ submissions });
  } catch (error) {
    return handleControllerError(res, error, 'Unable to fetch submissions');
  }
}
