import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  LifeBuoy,
  Loader2,
  Eye,
  EyeOff,
  Shield,
  UserPlus
} from 'lucide-react';

import { useAuth } from '../hooks/useAuth.js';

export default function LoginPage() {
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      let user;

      if (isRegister) {
        user = await register(
          form.name,
          form.email,
          form.password
        );

        toast.success(
          'Account created successfully'
        );
      } else {
        user = await login(
          form.email,
          form.password
        );

        toast.success(
          `Welcome back, ${user.name}`
        );
      }

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
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md">

        <div className="card p-8">

          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <LifeBuoy
                size={44}
                className="text-brand-500"
              />
            </div>

            <h1 className="text-3xl font-bold">
              DeskFlow
            </h1>

            <p className="text-gray-400 mt-2">
              Enterprise IT Service Management
            </p>
          </div>

          <div className="flex mb-6 bg-surface-border rounded-lg p-1">
            <button
              onClick={() =>
                setIsRegister(false)
              }
              className={`flex-1 py-2 rounded-md text-sm ${
                !isRegister
                  ? 'bg-brand-600 text-white'
                  : 'text-gray-400'
              }`}
            >
              Sign In
            </button>

            <button
              onClick={() =>
                setIsRegister(true)
              }
              className={`flex-1 py-2 rounded-md text-sm ${
                isRegister
                  ? 'bg-brand-600 text-white'
                  : 'text-gray-400'
              }`}
            >
              Create Account
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {isRegister && (
              <div>
                <label className="block text-sm mb-2 text-gray-400">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  className="input-field"
                  placeholder="John Smith"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

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
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading && (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              )}

              {isRegister ? (
                <>
                  <UserPlus size={18} />
                  Create Account
                </>
              ) : (
                <>
                  <Shield size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}