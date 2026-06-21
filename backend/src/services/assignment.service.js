import { prisma } from '../config/prisma.js';

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function validateId(id, label) {
  const value = String(id || '').trim();

  if (!value) {
    throw createHttpError(400, `${label} is required`);
  }

  return value;
}

function validateAssignmentInput({ title, description }) {
  const normalizedTitle = String(title || '').trim();
  const normalizedDescription = String(description || '').trim();

  if (!normalizedTitle) {
    throw createHttpError(400, 'Title is required');
  }

  if (!normalizedDescription) {
    throw createHttpError(400, 'Description is required');
  }

  return {
    title: normalizedTitle,
    description: normalizedDescription
  };
}

function validateRubricInput({ criterion, maxMarks }) {
  const normalizedCriterion = String(criterion || '').trim();
  const normalizedMaxMarks = Number(maxMarks);

  if (!normalizedCriterion) {
    throw createHttpError(400, 'Criterion is required');
  }

  if (!Number.isInteger(normalizedMaxMarks) || normalizedMaxMarks <= 0) {
    throw createHttpError(400, 'Max marks must be a positive integer');
  }

  return {
    criterion: normalizedCriterion,
    maxMarks: normalizedMaxMarks
  };
}

function toAssignmentResponse(assignment) {
  return {
    id: assignment.id,
    title: assignment.title,
    description: assignment.description,
    teacherId: assignment.teacherId,
    createdAt: assignment.createdAt,
    updatedAt: assignment.updatedAt
  };
}

function toRubricResponse(rubric) {
  return {
    id: rubric.id,
    assignmentId: rubric.assignmentId,
    criterion: rubric.criterion,
    maxMarks: rubric.maxMarks,
    createdAt: rubric.createdAt
  };
}

export async function createAssignmentForTeacher(teacherId, input) {
  const validatedTeacherId = validateId(teacherId, 'Teacher id');
  const assignmentInput = validateAssignmentInput(input);

  const teacher = await prisma.user.findUnique({
    where: { id: validatedTeacherId },
    select: { role: true }
  });

  if (!teacher) {
    throw createHttpError(404, 'Teacher not found');
  }

  if (teacher.role !== 'TEACHER') {
    throw createHttpError(403, 'Teacher access is required');
  }

  const assignment = await prisma.assignment.create({
    data: {
      ...assignmentInput,
      teacherId: validatedTeacherId
    }
  });

  return toAssignmentResponse(assignment);
}

export async function findAssignments() {
  const assignments = await prisma.assignment.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return assignments.map(toAssignmentResponse);
}

export async function findAssignmentById(assignmentId) {
  const validatedAssignmentId = validateId(assignmentId, 'Assignment id');

  const assignment = await prisma.assignment.findUnique({
    where: { id: validatedAssignmentId }
  });

  if (!assignment) {
    throw createHttpError(404, 'Assignment not found');
  }

  return toAssignmentResponse(assignment);
}

export async function createRubricForAssignment(assignmentId, teacherId, input) {
  const validatedAssignmentId = validateId(assignmentId, 'Assignment id');
  const validatedTeacherId = validateId(teacherId, 'Teacher id');
  const rubricInput = validateRubricInput(input);

  const assignment = await prisma.assignment.findUnique({
    where: { id: validatedAssignmentId }
  });

  if (!assignment) {
    throw createHttpError(404, 'Assignment not found');
  }

  if (assignment.teacherId !== validatedTeacherId) {
    throw createHttpError(403, 'Only the assignment teacher can add rubrics');
  }

  const rubric = await prisma.rubric.create({
    data: {
      ...rubricInput,
      assignmentId: validatedAssignmentId
    }
  });

  return toRubricResponse(rubric);
}

export async function findRubricsByAssignment(assignmentId) {
  const validatedAssignmentId = validateId(assignmentId, 'Assignment id');

  const assignment = await prisma.assignment.findUnique({
    where: { id: validatedAssignmentId },
    select: { id: true }
  });

  if (!assignment) {
    throw createHttpError(404, 'Assignment not found');
  }

  const rubrics = await prisma.rubric.findMany({
    where: { assignmentId: validatedAssignmentId },
    orderBy: { createdAt: 'asc' }
  });

  return rubrics.map(toRubricResponse);
}
