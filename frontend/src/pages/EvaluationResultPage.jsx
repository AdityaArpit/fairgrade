import { Bot, Gauge, RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { getApiErrorMessage } from '../services/api.js';
import { createEvaluation, getEvaluation } from '../services/evaluationService.js';

export default function EvaluationResultPage() {
  const { submissionId } = useParams();
  const { user } = useAuth();
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);

  async function loadEvaluation() {
    setError('');
    setIsLoading(true);

    try {
      setEvaluation(await getEvaluation(submissionId));
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Evaluation is not available yet'));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadEvaluation();
  }, [submissionId]);

  async function handleCreateEvaluation() {
    setError('');
    setIsEvaluating(true);

    try {
      setEvaluation(await createEvaluation(submissionId));
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to create evaluation'));
    } finally {
      setIsEvaluating(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Evaluation"
        title="Evaluation report"
        description="A structured AI-assisted score and feedback summary."
        action={
          user?.role === 'teacher' && !evaluation ? (
            <Button onClick={handleCreateEvaluation} disabled={isEvaluating}>
              <Bot size={18} />
              {isEvaluating ? 'Evaluating...' : 'Run Evaluation'}
            </Button>
          ) : null
        }
      />

      {isLoading ? (
        <LoadingState label="Loading evaluation" />
      ) : evaluation ? (
        <div className="grid gap-5 lg:grid-cols-[0.35fr_0.65fr]">
          <Card className="p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Gauge size={24} />
            </div>
            <p className="mt-6 text-sm font-medium text-slate-500">Score</p>
            <p className="mt-2 text-5xl font-bold tracking-tight text-slate-950">
              {evaluation.score}
            </p>
            <p className="mt-4 text-xs text-slate-500">
              Created {new Date(evaluation.createdAt).toLocaleString()}
            </p>
          </Card>

          <Card className="p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Detailed feedback
            </p>
            <div className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">
              {evaluation.feedback}
            </div>
          </Card>
        </div>
      ) : (
        <EmptyState
          title="Evaluation not available"
          description={error || 'This submission has not been evaluated yet.'}
          action={
            <Button variant="secondary" onClick={loadEvaluation}>
              <RefreshCcw size={17} />
              Refresh
            </Button>
          }
        />
      )}

      {error && evaluation ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}
    </div>
  );
}
