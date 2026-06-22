import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import FormField from '../components/FormField.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { getApiErrorMessage } from '../services/api.js';

export default function LoginPage() {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const user = await login(form);
      const fallbackPath = user.role === 'teacher' ? '/teacher' : '/student';
      navigate(location.state?.from?.pathname || fallbackPath, { replace: true });
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to login'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10">
      <Card className="w-full max-w-md p-7">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-950">Welcome back</h1>
            <p className="text-sm text-slate-500">Sign in to continue evaluating.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <FormField label="Email" name="email" type="email" value={form.email} onChange={updateField} required />
          <FormField label="Password" name="password" type="password" value={form.password} onChange={updateField} required />
          {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Login'}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          New here?{' '}
          <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">
            Create an account
          </Link>
        </p>
      </Card>
    </main>
  );
}
