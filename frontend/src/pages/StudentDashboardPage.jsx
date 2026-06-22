import { BookOpen, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import AssignmentCard from '../components/AssignmentCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import { getApiErrorMessage } from '../services/api.js';
import { getAssignments } from '../services/assignmentService.js';

export default function StudentDashboardPage() {
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAssignments() {
      try {
        setAssignments(await getAssignments());
      } catch (apiError) {
        setError(getApiErrorMessage(apiError, 'Unable to load assignments'));
      } finally {
        setIsLoading(false);
      }
    }

    loadAssignments();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Dashboard"
        title="Available assignments"
        description="Choose an assignment and submit a thoughtful answer for evaluation."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <StatCard icon={BookOpen} label="Available assignments" value={assignments.length} />
        <StatCard icon={FileText} label="Ready to submit" value={assignments.length} tone="emerald" />
      </div>

      {error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      {isLoading ? (
        <LoadingState label="Loading assignments" />
      ) : assignments.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {assignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              actionLabel="Submit answer"
              to={`/student/assignments/${assignment.id}/submit`}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No assignments available"
          description="Assignments created by teachers will appear here."
        />
      )}
    </div>
  );
}
