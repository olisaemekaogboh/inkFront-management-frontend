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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const redirectTarget = location.state?.from || "/";

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      const loginResult = await login({ identifier: email, email, password });
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
      <div
        className="premium-container"
        style={{
          maxWidth: "480px",
          margin: "0 auto",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          className="premium-contact-panel"
          style={{ padding: "48px 40px", textAlign: "center" }}
        >
          {/* Logo & Title - Centered */}
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "32px",
            }}
          >
            <InkFrontLogo />
            <h1
              style={{
                marginTop: "16px",
                marginBottom: "0",
                fontSize: "1.75rem",
                color: "var(--app-text)",
              }}
            >
              InkFront
            </h1>
          </Link>

          {/* Google Login */}
          <button
            type="button"
            className="premium-btn premium-btn-ghost"
            onClick={handleGoogleLogin}
            disabled={googleSubmitting || submitting}
            style={{ width: "100%", marginBottom: "20px" }}
          >
            {googleSubmitting ? "Redirecting..." : "Continue with Google"}
          </button>

          {/* Divider */}
          <div
            style={{
              margin: "20px 0",
              position: "relative",
              textAlign: "center",
            }}
          >
            <hr
              style={{
                border: "none",
                borderTop: "1px solid var(--app-border)",
              }}
            />
            <span
              style={{
                position: "relative",
                top: "-12px",
                background: "var(--app-card)",
                padding: "0 12px",
                color: "var(--app-muted)",
                fontSize: "0.8rem",
              }}
            >
              or
            </span>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div
              className="premium-form-alert premium-form-alert-error"
              style={{ marginBottom: "20px" }}
            >
              {errorMessage}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              disabled={submitting || googleSubmitting}
              style={{
                width: "100%",
                marginBottom: "16px",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid var(--app-border)",
                background: "var(--app-card)",
                color: "var(--app-text)",
              }}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              disabled={submitting || googleSubmitting}
              style={{
                width: "100%",
                marginBottom: "24px",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid var(--app-border)",
                background: "var(--app-card)",
                color: "var(--app-text)",
              }}
            />
            <button
              type="submit"
              className="premium-btn premium-btn-primary"
              disabled={submitting || googleSubmitting}
              style={{ width: "100%" }}
            >
              {submitting ? "Signing in..." : "Login"}
            </button>
          </form>

          {/* Register Link */}
          <p
            style={{
              marginTop: "24px",
              color: "var(--app-muted)",
              fontSize: "0.85rem",
            }}
          >
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--app-primary)" }}>
              Create account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
