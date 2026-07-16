import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LifeBuoy, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await register(
        form.name,
        form.email,
        form.password
      );

      toast.success(
        `Welcome to DeskFlow, ${user.name}`
      );

      navigate('/employee');
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          'Registration failed'
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="card w-full max-w-md p-8">
        <div className="flex items-center justify-center gap-2 mb-6">
          <LifeBuoy
            className="text-brand-500"
            size={30}
          />
          <h1 className="text-2xl font-bold">
            DeskFlow
          </h1>
        </div>

        <p className="text-center text-sm text-gray-400 mb-6">
          Create your DeskFlow account
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="John Doe"
              className="input-field"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="john@company.com"
              className="input-field"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              className="input-field"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading && (
              <Loader2
                size={16}
                className="animate-spin"
              />
            )}

            {loading
              ? 'Creating Account...'
              : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-brand-500 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}