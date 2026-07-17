import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import {
  LifeBuoy,
  Loader2,
  UserPlus,
} from 'lucide-react';

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
        `Welcome ${user.name}`
      );

      navigate(
        user.role === 'admin'
          ? '/admin'
          : '/employee'
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        <div className="card p-8">

          <div className="text-center mb-8">

            <div className="w-16 h-16 rounded-2xl bg-brand-600/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-4">
              <LifeBuoy
                size={34}
                className="text-brand-500"
              />
            </div>

            <h1 className="text-3xl font-bold">
              Create Account
            </h1>

            <p className="text-gray-400 mt-2">
              Join DeskFlow
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="input-field"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="input-field"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input-field"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >

              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Create Account
                </>
              )}

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

    </div>
  );
}