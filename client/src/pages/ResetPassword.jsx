import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FileText, Eye, EyeOff, Loader2 } from "lucide-react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords don't match.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post(`/auth/reset-password/${token}`, { password });
      localStorage.setItem("token", data.token);
      await refreshUser();
      toast.success("Password reset. You're signed in.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "This reset link is invalid or has expired.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-lg text-zinc-900">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
              <FileText className="w-4.5 h-4.5 text-white" />
            </div>
            ResumeCraft
          </Link>
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-bold text-zinc-900 mb-1">Set a new password</h1>
          <p className="text-sm text-zinc-500 mb-6">Choose a new password for your account.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-600 mb-1.5">New password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-10"
                  placeholder="••••••••"
                  required
                  autoFocus
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Confirm password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Resetting…" : "Reset password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
