import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAssignmentSubmissions } from '../services/submissionService.js';
import { createEvaluation } from '../services/evaluationService.js';

export default function AssignmentSubmissionsPage() {
  const { id } = useParams();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSubmissions() {
      try {
        const data = await getAssignmentSubmissions(id);
        setSubmissions(data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load submissions');
      } finally {
        setLoading(false);
      }
    }

    loadSubmissions();
  }, [id]);

  async function handleEvaluate(submissionId) {
    try {
      const evaluation = await createEvaluation(submissionId);
      window.location.href = `/evaluations/${submissionId}`;
    } catch (err) {
      alert(
        err?.response?.data?.message || 'Failed to create evaluation'
      );
    }
  }

  if (loading) {
    return <p>Loading submissions...</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Assignment Submissions</h1>

      {error && (
        <p className="rounded-lg bg-red-100 p-3 text-red-700">
          {error}
        </p>
      )}

      {submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        submissions.map((submission) => (
          <div
            key={submission.id}
            className="rounded-xl border border-slate-200 bg-white p-6"
          >
            <p className="font-semibold">
              Submission ID:
            </p>
            
            <p className="text-sm text-slate-600">
              {submission.id}
            </p>

            <p className="mb-4 text-sm text-slate-600">
              Submitted:
                {' '}
                {new Date(submission.createdAt).toLocaleString()}
            </p>

            <p className="font-semibold">
              Student Answer:
            </p>

            <p className="mt-2 whitespace-pre-wrap text-slate-700">
              {submission.answer}
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => handleEvaluate(submission.id)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white"
              >
                Run Evaluation
              </button>

              <Link
                to={`/evaluations/${submission.id}`}
                className="rounded-lg border px-4 py-2"
              >
                View Evaluation
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}