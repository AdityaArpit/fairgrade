import {
  createAssignmentForTeacher,
  createRubricForAssignment,
  findAssignmentById,
  findAssignments,
  findRubricsByAssignment
} from '../services/assignment.service.js';

function handleControllerError(res, error, fallbackMessage) {
  return res.status(error.statusCode || 500).json({
    message: error.message || fallbackMessage
  });
}

export async function createAssignment(req, res) {
  try {
    const assignment = await createAssignmentForTeacher(req.user.id, req.body);
    return res.status(201).json({ assignment });
  } catch (error) {
    return handleControllerError(res, error, 'Unable to create assignment');
  }
}

export async function getAssignments(_req, res) {
  try {
    const assignments = await findAssignments();
    return res.json({ assignments });
  } catch (error) {
    return handleControllerError(res, error, 'Unable to fetch assignments');
  }
}

export async function getAssignmentById(req, res) {
  try {
    const assignment = await findAssignmentById(req.params.id);
    return res.json({ assignment });
  } catch (error) {
    return handleControllerError(res, error, 'Unable to fetch assignment');
  }
}

export async function createRubric(req, res) {
  try {
    const rubric = await createRubricForAssignment(
      req.params.id,
      req.user.id,
      req.body
    );
    return res.status(201).json({ rubric });
  } catch (error) {
    return handleControllerError(res, error, 'Unable to create rubric');
  }
}

export async function getRubricsByAssignment(req, res) {
  try {
    const rubrics = await findRubricsByAssignment(req.params.id);
    return res.json({ rubrics });
  } catch (error) {
    return handleControllerError(res, error, 'Unable to fetch rubrics');
  }
}
