import {
  GraduationCap,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Sparkles
} from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import Button from '../components/Button.jsx';
import { useAuth } from '../hooks/useAuth.jsx';

export default function DashboardLayout() {
  const { logout, user } = useAuth();
  const isTeacher = user?.role === 'teacher';
  const navItems = isTeacher
    ? [
        { label: 'Dashboard', to: '/teacher', icon: LayoutDashboard },
        { label: 'Create Assignment', to: '/teacher/assignments/new', icon: PlusCircle }
      ]
    : [{ label: 'Dashboard', to: '/student', icon: LayoutDashboard }];

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200 bg-white px-4 py-5 lg:block">
        <Link to="/" className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="font-bold tracking-tight text-slate-950">FairGrade</p>
            <p className="text-xs text-slate-500">Answer evaluation</p>
          </div>
        </Link>

        <nav className="mt-8 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-slate-950 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-5 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 lg:hidden">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  {isTeacher ? 'Teacher workspace' : 'Student workspace'}
                </p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 sm:flex">
                <GraduationCap size={15} />
                {user?.role}
              </div>
              <Button variant="ghost" onClick={logout}>
                <LogOut size={17} />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="px-5 py-8 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
