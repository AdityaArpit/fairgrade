import { ArrowRight, CalendarDays, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from './Card.jsx';

export default function AssignmentCard({ assignment, actionLabel, to }) {
  return (
    <Card className="group p-5 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <FileText size={20} />
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          Active
        </span>
      </div>
      <h3 className="mt-5 line-clamp-2 text-lg font-semibold text-slate-950">
        {assignment.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
        {assignment.description}
      </p>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <CalendarDays size={15} />
          {new Date(assignment.createdAt).toLocaleDateString()}
        </div>
        {to ? (
          <Link
            to={to}
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition group-hover:gap-2"
          >
            {actionLabel}
            <ArrowRight size={16} />
          </Link>
        ) : null}
      </div>
    </Card>
  );
}
