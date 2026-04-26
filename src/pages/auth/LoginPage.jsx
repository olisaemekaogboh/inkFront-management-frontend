import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { authService } from "../../services/authService";

export default function LoginPage() {
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      await login(form);
      window.location.assign("/admin");
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Login failed. Please check your details and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleSubmitting(true);
    window.location.assign(authService.getGoogleLoginUrl());
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="card" style={{ maxWidth: "480px", margin: "0 auto" }}>
          <div
            className="card__content"
            style={{ padding: "var(--space-2xl)" }}
          >
            <div className="text-center mb-32">
              <h1 className="text-2xl font-bold mb-8">Welcome Back</h1>
              <p className="text-sm text-muted">
                Login to access your dashboard
              </p>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleSubmitting}
              className="btn btn--outline w-full mb-20"
              style={{ justifyContent: "center" }}
            >
              <span className="mr-8">G</span>
              {googleSubmitting ? "Redirecting..." : "Continue with Google"}
            </button>

            <div className="d-flex align-center gap-12 my-20">
              <div
                className="flex-1"
                style={{ height: "1px", background: "var(--color-border)" }}
              />
              <span className="text-xs text-muted">or</span>
              <div
                className="flex-1"
                style={{ height: "1px", background: "var(--color-border)" }}
              />
            </div>

            <form onSubmit={handleSubmit} className="d-flex flex-column gap-16">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="form-input"
                  required
                />
              </div>

              {errorMessage && (
                <div
                  className="error"
                  style={{
                    padding: "var(--space-md)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn btn--primary w-full"
              >
                {submitting ? "Signing in..." : "Login"}
              </button>
            </form>

            <p className="text-center text-sm text-muted mt-24">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
