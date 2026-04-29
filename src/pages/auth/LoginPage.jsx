import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { authService } from "../../services/authService";
import "../../styles/publicPremium.css";

function InkFrontLogo() {
  return (
    <span className="inkfront-brand-mark" aria-hidden="true">
      <svg viewBox="0 0 48 48">
        <path d="M10 8h28a2 2 0 0 1 2 2v6H17v7h18v6H17v11h-7V8Z" />
        <path d="M25 23h13v17h-7V29h-6v-6Z" />
      </svg>
    </span>
  );
}

function hasAdminRole(user) {
  const roles = Array.isArray(user?.roles) ? user.roles : [];

  return (
    roles.includes("ADMIN") ||
    roles.includes("ROLE_ADMIN") ||
    roles.includes("SUPER_ADMIN") ||
    roles.includes("ROLE_SUPER_ADMIN")
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({
    identifier: "",
    email: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const redirectTarget = location.state?.from || "/";

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "email" ? { identifier: value } : {}),
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitting(true);
    setErrorMessage("");

    try {
      const loginResult = await login({
        identifier: form.identifier || form.email,
        email: form.email || form.identifier,
        password: form.password,
      });

      const currentUser = loginResult?.user || loginResult?.data?.user || null;

      if (redirectTarget.startsWith("/admin") && !hasAdminRole(currentUser)) {
        navigate("/", { replace: true });
        return;
      }

      navigate(redirectTarget, { replace: true });
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Login failed. Please check your details and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleGoogleLogin() {
    setGoogleSubmitting(true);
    window.location.assign(authService.getGoogleLoginUrl());
  }

  return (
    <main className="premium-public-page">
      <section className="premium-section">
        <div className="premium-container">
          <article
            className="premium-contact-panel"
            style={{
              maxWidth: "540px",
              margin: "0 auto",
            }}
          >
            <Link
              to="/"
              className="premium-footer__logo"
              style={{
                display: "inline-flex",
                marginBottom: "26px",
                textDecoration: "none",
              }}
            >
              <InkFrontLogo />
              <strong
                style={{
                  color: "var(--app-text)",
                }}
              >
                InkFront
              </strong>
            </Link>

            <span className="premium-eyebrow">Secure Access</span>

            <h2 style={{ marginTop: "16px" }}>Welcome back</h2>

            <p>
              Login to continue to InkFront. Admin users can access the
              dashboard, while regular users continue to the public website.
            </p>

            <button
              type="button"
              className="premium-btn premium-btn-ghost"
              onClick={handleGoogleLogin}
              disabled={googleSubmitting || submitting}
              style={{
                width: "100%",
                marginTop: "20px",
              }}
            >
              {googleSubmitting ? "Redirecting..." : "Continue with Google"}
            </button>

            <div
              style={{
                margin: "18px 0",
                textAlign: "center",
                color: "var(--app-muted)",
                fontWeight: "700",
              }}
            >
              or sign in with email
            </div>

            {errorMessage ? (
              <div className="premium-form-alert premium-form-alert-error">
                {errorMessage}
              </div>
            ) : null}

            <form className="premium-contact-form" onSubmit={handleSubmit}>
              <label>
                Email Address
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  disabled={submitting || googleSubmitting}
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  placeholder="Enter password"
                  disabled={submitting || googleSubmitting}
                />
              </label>

              <button
                type="submit"
                className="premium-btn premium-btn-primary"
                disabled={submitting || googleSubmitting}
                style={{ width: "100%" }}
              >
                {submitting ? "Signing in..." : "Login"}
              </button>
            </form>

            <p
              style={{
                marginTop: "20px",
                textAlign: "center",
                color: "var(--app-muted)",
              }}
            >
              Don&apos;t have an account? <Link to="/register">Create one</Link>
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
