import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import {
  LifeBuoy,
  Loader2,
  Eye,
  EyeOff,
  Shield,
  User,
  Settings,
} from 'lucide-react';

import { useAuth } from '../hooks/useAuth.js';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [form, setForm] = useState({
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
      const user = await login(
        form.email,
        form.password
      );

      toast.success(
        `Welcome back, ${user.name}`
      );

      navigate(
        user.role === 'admin'
          ? '/admin'
          : '/employee'
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          'Login failed'
      );
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 relative overflow-hidden">

      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-600/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-500/10 blur-3xl rounded-full" />

      <div className="w-full max-w-md relative z-10">

        <div className="card p-8 shadow-2xl">

          <div className="text-center mb-8">

            <div className="w-20 h-20 rounded-3xl bg-brand-600/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-5">
              <LifeBuoy
                size={38}
                className="text-brand-500"
              />
            </div>

            <h1 className="text-4xl font-bold">
              DeskFlow
            </h1>

            <p className="text-gray-400 mt-3">
              AI-Powered IT Service Desk
            </p>

          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">

            <div className="border border-surface-border rounded-xl p-4 text-center">
              <User
                size={22}
                className="mx-auto mb-2 text-brand-400"
              />
              <h3 className="font-medium">
                Employee
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Submit & track requests
              </p>
            </div>

            <div className="border border-surface-border rounded-xl p-4 text-center">
              <Settings
                size={22}
                className="mx-auto mb-2 text-brand-400"
              />
              <h3 className="font-medium">
                Admin
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Manage tickets
              </p>
            </div>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm mb-2 text-gray-400">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                className="input-field"
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-400">
                Password
              </label>

              <div className="relative">
                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  name="password"
                  className="input-field pr-10"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              {loading && (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              )}

              <Shield size={18} />
              Sign In
            </button>

            <p className="text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-brand-500 hover:underline"
              >
                Create Account
              </Link>
            </p>

          </form>

        </div>

        <p className="text-center text-xs text-gray-500 mt-5">
          DeskFlow © 2026
        </p>

      </div>
    </div>
  );
}