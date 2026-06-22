import { ClipboardList, FileText, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AssignmentCard from '../components/AssignmentCard.jsx';
import Button from '../components/Button.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import { getApiErrorMessage } from '../services/api.js';
import { getAssignments } from '../services/assignmentService.js';

export default function TeacherDashboardPage() {
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
        title="Teacher overview"
        description="Create assignments and monitor the evaluation workspace."
        action={
          <Link to="/teacher/assignments/new">
            <Button>
              <PlusCircle size={18} />
              Create Assignment
            </Button>
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={ClipboardList} label="Total assignments" value={assignments.length} />
        <StatCard icon={FileText} label="Active assignments" value={assignments.length} tone="emerald" />
        <StatCard icon={PlusCircle} label="Ready for submissions" value={assignments.length} tone="violet" />
      </div>

      {error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      {isLoading ? (
        <LoadingState label="Loading assignments" />
      ) : assignments.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {assignments.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No assignments yet"
          description="Create your first assignment to start collecting student responses."
          action={
            <Link to="/teacher/assignments/new">
              <Button>Create Assignment</Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
