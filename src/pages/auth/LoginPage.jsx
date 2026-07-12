import { useState, useEffect } from "react";
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
  const { login, refreshCurrentUser, isAuthenticated, user, loading } =
    useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(location.state?.error || "");
  const [fieldErrors, setFieldErrors] = useState({});

  const redirectTarget = location.state?.from || "/";

  // Check if already logged in after auth state updates
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      console.log("Already authenticated, redirecting...");
      const isAdmin = hasAdminRole(user);
      if (redirectTarget.startsWith("/admin") && !isAdmin) {
        navigate("/", { replace: true });
      } else {
        navigate(redirectTarget, { replace: true });
      }
    }
  }, [loading, isAuthenticated, user, navigate, redirectTarget]);

  function handleChange(event) {
    const { name, value } = event.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (errorMessage) setErrorMessage("");
  }

  function validateForm() {
    const errors = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setFieldErrors({});

    try {
      console.log("Attempting login with:", email);

      // Perform login
      const loginResult = await login({ identifier: email, email, password });
      console.log("Login result:", loginResult);

      // Refresh user data after login
      await refreshCurrentUser();
    } catch (error) {
      console.error("Full error object:", error);
      console.error("Error response:", error.response);
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);
      console.error("Error message:", error.message);

      // Check if it's a network error
      if (
        error.message === "Network Error" ||
        error.code === "ERR_NETWORK" ||
        !error.response
      ) {
        setErrorMessage(
          "Cannot connect to server. Please make sure the backend is running on port 8080.",
        );
        setSubmitting(false);
        return;
      }

      const status = error.response?.status;
      const errorData = error.response?.data;

      // Handle 401 Unauthorized - Wrong password
      if (status === 401) {
        setErrorMessage("Invalid email or password. Please try again.");
        setFieldErrors({
          email: "Invalid credentials",
          password: "Invalid credentials",
        });
      }
      // Handle 403 Forbidden
      else if (status === 403) {
        setErrorMessage("Your account is locked. Please contact support.");
      }
      // Handle 404 Not Found
      else if (status === 404) {
        setErrorMessage(
          "Account not found. Please check your email or register.",
        );
        setFieldErrors({ email: "No account found with this email" });
      }
      // Handle 400 Bad Request
      else if (status === 400) {
        if (errorData?.message) {
          setErrorMessage(errorData.message);
        } else {
          setErrorMessage("Invalid request. Please check your information.");
        }
      }
      // Handle 500 Server Error
      else if (status === 500) {
        setErrorMessage("Server error. Please try again later.");
      }
      // Handle other errors
      else {
        setErrorMessage(
          errorData?.message ||
            errorData?.error ||
            error?.message ||
            "Login failed. Please try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleGoogleLogin() {
    setGoogleSubmitting(true);
    const googleUrl = authService.getGoogleLoginUrl();
    console.log("Redirecting to Google OAuth:", googleUrl);
    window.location.href = googleUrl;
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Show loading state
  if (loading) {
    return (
      <main className="premium-public-page">
        <div className="premium-container">
          <div
            className="premium-contact-panel"
            style={{ padding: "48px 40px", textAlign: "center" }}
          >
            <div className="premium-loading">Loading...</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="premium-public-page">
      <div
        className="premium-container"
        style={{
          maxWidth: "480px",
          margin: "-40px auto",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          paddingTop: "0",
        }}
      >
        <div
          className="premium-contact-panel"
          style={{ padding: "48px 40px", width: "100%" }}
        >
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
              Welcome Back
            </h1>
            <p
              style={{
                marginTop: "8px",
                color: "var(--app-muted)",
                fontSize: "0.875rem",
              }}
            >
              Sign in to your account
            </p>
          </Link>

          <button
            type="button"
            className="premium-btn premium-btn-ghost"
            onClick={handleGoogleLogin}
            disabled={googleSubmitting || submitting}
            style={{ width: "100%", marginBottom: "20px" }}
          >
            {googleSubmitting ? "Redirecting..." : "Continue with Google"}
          </button>

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
              or sign in with email
            </span>
          </div>

          {errorMessage && (
            <div
              className="premium-form-alert premium-form-alert-error"
              style={{ marginBottom: "20px" }}
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="premium-contact-form__field">
              <label className="premium-contact-form__label">
                <span>Email Address *</span>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`premium-contact-form__input ${fieldErrors.email ? "has-error" : ""}`}
                  autoComplete="email"
                  disabled={submitting || googleSubmitting}
                />
                {fieldErrors.email && (
                  <span className="premium-error-message">
                    {fieldErrors.email}
                  </span>
                )}
              </label>
            </div>

            <div className="premium-contact-form__field">
              <label className="premium-contact-form__label">
                <span>Password *</span>
                <div className="premium-password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`premium-contact-form__input ${fieldErrors.password ? "has-error" : ""}`}
                    autoComplete="current-password"
                    disabled={submitting || googleSubmitting}
                  />
                  <button
                    type="button"
                    className="premium-password-toggle"
                    onClick={togglePasswordVisibility}
                    tabIndex="-1"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {fieldErrors.password && (
                  <span className="premium-error-message">
                    {fieldErrors.password}
                  </span>
                )}
              </label>
            </div>

            <button
              type="submit"
              className="premium-btn premium-btn-primary"
              disabled={submitting || googleSubmitting}
              style={{ width: "100%", marginTop: "24px" }}
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p
            style={{
              marginTop: "24px",
              textAlign: "center",
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
