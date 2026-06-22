import { env } from '../config/env.js';
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

function toEvaluationResponse(evaluation) {
  return {
    id: evaluation.id,
    submissionId: evaluation.submissionId,
    score: evaluation.score,
    feedback: evaluation.feedback,
    createdAt: evaluation.createdAt
  };
}

function buildEvaluationPrompt({ assignment, submission, rubrics }) {
  const rubricLines = rubrics
    .map((rubric) => `- ${rubric.criterion} (${rubric.maxMarks})`)
    .join('\n');

  return `Assignment:
${assignment.title}

Student Answer:
${submission.answer}

Rubrics:
${rubricLines || '- No rubric criteria provided'}

Evaluate the answer.

Return ONLY valid JSON:

{
  "score": number,
  "feedback": "detailed feedback"
}`;
}

function extractJsonObject(text) {
  const trimmedText = String(text || '').trim();

  if (!trimmedText) {
    throw createHttpError(502, 'Gemini returned an empty response');
  }

  try {
    return JSON.parse(trimmedText);
  } catch (_error) {
    const jsonMatch = trimmedText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw createHttpError(502, 'Gemini did not return valid JSON');
    }

    try {
      return JSON.parse(jsonMatch[0]);
    } catch (_jsonError) {
      throw createHttpError(502, 'Gemini did not return valid JSON');
    }
  }
}

function validateGeminiEvaluationPayload(payload) {
  const score = Number(payload.score);
  const feedback = String(payload.feedback || '').trim();

  if (!Number.isFinite(score)) {
    throw createHttpError(502, 'Gemini returned an invalid score');
  }

  if (!feedback) {
    throw createHttpError(502, 'Gemini returned empty feedback');
  }

  return { score, feedback };
}

async function requestGeminiEvaluation(prompt) {
  if (!env.openRouterApiKey) {
    throw createHttpError(500, 'OPENROUTER_API_KEY is not configured');
  }

  if (!env.openRouterModel) {
    throw createHttpError(500, 'OPENROUTER_MODEL is not configured');
  }

  const response = await fetch(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.openRouterApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: env.openRouterModel,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: {
          type: 'json_object'
        },
        max_tokens: 500
      })
    }
  );

  const responseBody = await response.json().catch(() => null);

  if (!response.ok) {
    throw createHttpError(
      502,
      responseBody?.error?.message || 'OpenRouter evaluation request failed'
    );
  }

  const text = responseBody?.choices?.[0]?.message?.content;
  return validateGeminiEvaluationPayload(extractJsonObject(text));
}

async function findSubmissionWithContext(submissionId) {
  const validatedSubmissionId = validateId(submissionId, 'Submission id');

  const submission = await prisma.submission.findUnique({
    where: { id: validatedSubmissionId },
    include: {
      assignment: {
        include: {
          rubrics: {
            orderBy: { createdAt: 'asc' }
          }
        }
      },
      evaluation: true
    }
  });

  if (!submission) {
    throw createHttpError(404, 'Submission not found');
  }

  return submission;
}

export async function createEvaluationForSubmission(submissionId, teacherId) {
  const validatedTeacherId = validateId(teacherId, 'Teacher id');
  const submission = await findSubmissionWithContext(submissionId);

  if (submission.assignment.teacherId !== validatedTeacherId) {
    throw createHttpError(403, 'Only the assignment teacher can evaluate this submission');
  }

  if (submission.evaluation) {
    throw createHttpError(400, 'Submission is already evaluated');
  }

  const prompt = buildEvaluationPrompt({
    assignment: submission.assignment,
    submission,
    rubrics: submission.assignment.rubrics
  });

  const geminiEvaluation = await requestGeminiEvaluation(prompt);

  try {
    const evaluation = await prisma.evaluation.create({
      data: {
        submissionId: submission.id,
        score: geminiEvaluation.score,
        feedback: geminiEvaluation.feedback
      }
    });

    return toEvaluationResponse(evaluation);
  } catch (error) {
    if (error.code === 'P2002') {
      throw createHttpError(400, 'Submission is already evaluated');
    }

    throw error;
  }
}

export async function findEvaluationForSubmission(submissionId, requester) {
  const submission = await findSubmissionWithContext(submissionId);
  const requesterRole = String(requester?.role || '').toLowerCase();
  const requesterId = validateId(requester?.id, 'User id');

  if (requesterRole === 'teacher') {
    if (submission.assignment.teacherId !== requesterId) {
      throw createHttpError(403, 'Only the assignment teacher can view this evaluation');
    }
  } else if (requesterRole === 'student') {
    if (submission.studentId !== requesterId) {
      throw createHttpError(403, 'Students can only view their own evaluations');
    }
  } else {
    throw createHttpError(403, 'Unauthorized role');
  }

  if (!submission.evaluation) {
    throw createHttpError(404, 'Evaluation not found');
  }

  return toEvaluationResponse(submission.evaluation);
}
