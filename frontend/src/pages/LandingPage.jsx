import { ArrowRight, BarChart3, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';

const features = [
  {
    icon: ShieldCheck,
    title: 'Role-aware workflows',
    description: 'Teachers create assignments while students submit answers in a focused workspace.'
  },
  {
    icon: Sparkles,
    title: 'AI-assisted evaluation',
    description: 'Structured rubrics guide consistent scoring and clear feedback reports.'
  },
  {
    icon: BarChart3,
    title: 'Clean dashboards',
    description: 'Assignments, submissions, and evaluation outcomes are presented with clarity.'
  }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
            <Sparkles size={20} />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-950">FairGrade</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/register">
            <Button>Register</Button>
          </Link>
        </div>
      </nav>

      <section className="relative overflow-hidden border-y border-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_35%),linear-gradient(135deg,#ffffff,#f8fafc_45%,#eff6ff)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/70 px-3 py-1 text-sm font-medium text-blue-700 shadow-sm">
              <CheckCircle2 size={16} />
              Fair & Consistent Academic Evaluation
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl">
              Ensure fair and consistent grading with AI-powered evaluation.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              FairGrade helps educators evaluate student answers consistently using rubric-based AI scoring, detailed feedback, and streamlined teacher-student workflows.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/register">
                <Button className="w-full sm:w-auto">
                  Start free
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" className="w-full sm:w-auto">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>

          <Card className="p-4">
            <div className="rounded-lg bg-slate-950 p-5 text-white">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-300">FairGrade report</p>
                <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-semibold text-emerald-200">
                  Complete
                </span>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-white/10 p-4">
                  <p className="text-sm text-slate-300">Score</p>
                  <p className="mt-2 text-3xl font-bold">8.5</p>
                </div>
                <div className="rounded-lg bg-white/10 p-4 sm:col-span-2">
                  <p className="text-sm text-slate-300">Feedback</p>
                  <p className="mt-2 text-sm leading-6 text-slate-100">
                    Strong conceptual clarity with room to improve examples and conclusion structure.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <feature.icon size={22} />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-slate-950">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
