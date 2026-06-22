import { ArrowLeft, Send } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { getApiErrorMessage } from '../services/api.js';
import { createSubmission } from '../services/submissionService.js';

export default function SubmitAnswerPage() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const characterCount = useMemo(() => answer.length, [answer]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const submission = await createSubmission({ assignmentId, answer });
      navigate(`/evaluations/${submission.id}`);
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to submit answer'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Submission"
        title="Submit answer"
        description="Write a complete answer. You can review the evaluation report after it is created."
      />

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="answer">
              Answer editor
            </label>
            <textarea
              id="answer"
              rows={16}
              className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm leading-7 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="Write your answer here..."
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              required
            />
            <div className="mt-2 flex justify-between text-xs text-slate-500">
              <span>Minimum effort matters. Be clear and complete.</span>
              <span>{characterCount} characters</span>
            </div>
          </div>

          {error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Link to="/student">
              <Button variant="secondary" className="w-full sm:w-auto">
                <ArrowLeft size={18} />
                Back
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              <Send size={18} />
              {isSubmitting ? 'Submitting...' : 'Submit Answer'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
