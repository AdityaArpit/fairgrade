import { ArrowLeft, Save } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import FormField from '../components/FormField.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { getApiErrorMessage } from '../services/api.js';
import { createAssignment } from '../services/assignmentService.js';

export default function CreateAssignmentPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '' });
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
      await createAssignment(form);
      navigate('/teacher');
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to create assignment'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Assignments"
        title="Create assignment"
        description="Set the task students will respond to. Rubrics can be managed through the backend API."
      />

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField
            label="Title"
            name="title"
            placeholder="Essay on photosynthesis"
            value={form.title}
            onChange={updateField}
            required
          />
          <FormField
            as="textarea"
            label="Description"
            name="description"
            rows={8}
            placeholder="Describe the assignment expectations..."
            value={form.description}
            onChange={updateField}
            required
          />
          {error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Link to="/teacher">
              <Button variant="secondary" className="w-full sm:w-auto">
                <ArrowLeft size={18} />
                Back
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              <Save size={18} />
              {isSubmitting ? 'Creating...' : 'Create Assignment'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
