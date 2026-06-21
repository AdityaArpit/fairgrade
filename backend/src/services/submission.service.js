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

function validateSubmissionInput({ assignmentId, answer }) {
  const normalizedAssignmentId = validateId(assignmentId, 'Assignment id');
  const normalizedAnswer = String(answer || '').trim();

  if (!normalizedAnswer) {
    throw createHttpError(400, 'Answer is required');
  }

  return {
    assignmentId: normalizedAssignmentId,
    answer: normalizedAnswer
  };
}

function toSubmissionResponse(submission) {
  return {
    id: submission.id,
    assignmentId: submission.assignmentId,
    studentId: submission.studentId,
    answer: submission.answer,
    createdAt: submission.createdAt,
    updatedAt: submission.updatedAt
  };
}

export async function createSubmissionForStudent(studentId, input) {
  const validatedStudentId = validateId(studentId, 'Student id');
  const submissionInput = validateSubmissionInput(input);

  const student = await prisma.user.findUnique({
    where: { id: validatedStudentId },
    select: { role: true }
  });

  if (!student) {
    throw createHttpError(404, 'Student not found');
  }

  if (student.role !== 'STUDENT') {
    throw createHttpError(403, 'Student access is required');
  }

  const assignment = await prisma.assignment.findUnique({
    where: { id: submissionInput.assignmentId },
    select: { id: true }
  });

  if (!assignment) {
    throw createHttpError(404, 'Assignment not found');
  }

  const submission = await prisma.submission.create({
    data: {
      assignmentId: submissionInput.assignmentId,
      studentId: validatedStudentId,
      answer: submissionInput.answer
    }
  });

  return toSubmissionResponse(submission);
}

export async function findSubmissionsByStudent(studentId) {
  const validatedStudentId = validateId(studentId, 'Student id');

  const submissions = await prisma.submission.findMany({
    where: { studentId: validatedStudentId },
    orderBy: { createdAt: 'desc' }
  });

  return submissions.map(toSubmissionResponse);
}

export async function findSubmissionsForTeacherAssignment(
  assignmentId,
  teacherId
) {
  const validatedAssignmentId = validateId(assignmentId, 'Assignment id');
  const validatedTeacherId = validateId(teacherId, 'Teacher id');

  const assignment = await prisma.assignment.findUnique({
    where: { id: validatedAssignmentId },
    select: { teacherId: true }
  });

  if (!assignment) {
    throw createHttpError(404, 'Assignment not found');
  }

  if (assignment.teacherId !== validatedTeacherId) {
    throw createHttpError(403, 'Only the assignment teacher can view submissions');
  }

  const submissions = await prisma.submission.findMany({
    where: { assignmentId: validatedAssignmentId },
    orderBy: { createdAt: 'desc' }
  });

  return submissions.map(toSubmissionResponse);
}
