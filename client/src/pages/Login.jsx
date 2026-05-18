import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BarChart3, Loader2, LockKeyhole } from "lucide-react";
import api, { getErrorMessage } from "../api";

export default function Login({ mode, saveSession }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "Admin User",
    email: "admin@talentiq.com",
    password: "admin123"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isSignup = mode === "signup";

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isSignup ? "/auth/signup" : "/auth/login";
      const payload = isSignup ? form : { email: form.email, password: form.password };
      const { data } = await api.post(endpoint, payload);
      saveSession(data);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-screen">
      <section className="auth-panel">
        <div className="brand-mark large">
          <BarChart3 size={24} />
        </div>
        <h1>TalentIQ</h1>
        <p className="auth-subtitle">Performance Analytics</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {isSignup && (
            <label>
              Name
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              minLength={6}
              required
            />
          </label>
          {error && <div className="alert error">{error}</div>}
          <button className="primary-button full" disabled={loading} type="submit">
            {loading ? <Loader2 className="spin" size={16} /> : <LockKeyhole size={16} />}
            {isSignup ? "Create Account" : "Login"}
          </button>
        </form>

        <Link className="auth-link" to={isSignup ? "/login" : "/signup"}>
          {isSignup ? "Already have an account? Login" : "New admin? Create account"}
        </Link>
      </section>
    </main>
  );
}
