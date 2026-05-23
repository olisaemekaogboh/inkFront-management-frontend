import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
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

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [touched, setTouched] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));

    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: "" }));
    }
    if (generalError) setGeneralError("");
    if (successMessage) setSuccessMessage("");
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const fieldError = validateField(name, form[name]);
    if (fieldError) {
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function validateField(fieldName, value) {
    switch (fieldName) {
      case "firstName":
        if (!value.trim()) return "First name is required";
        if (value.length < 2) return "First name must be at least 2 characters";
        return "";
      case "lastName":
        if (!value.trim()) return "Last name is required";
        if (value.length < 2) return "Last name must be at least 2 characters";
        return "";
      case "username":
        if (!value.trim()) return "Username is required";
        if (value.length < 3) return "Username must be at least 3 characters";
        if (!/^[a-zA-Z0-9_]+$/.test(value))
          return "Username can only contain letters, numbers, and underscores";
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Please enter a valid email address";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        return "";
      case "confirmPassword":
        if (value !== form.password) return "Passwords do not match";
        return "";
      default:
        return "";
    }
  }

  function validateForm() {
    const newErrors = {};
    const fieldsToValidate = [
      "firstName",
      "lastName",
      "username",
      "email",
      "password",
      "confirmPassword",
    ];

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, form[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const allTouched = {
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
    };
    setTouched(allTouched);

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setGeneralError("");
    setSuccessMessage("");

    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      };

      const result = await register(payload);

      setSuccessMessage(
        "Account created successfully! Redirecting to dashboard...",
      );

      setTimeout(() => {
        navigate("/admin", { replace: true });
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);

      // Network error
      if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
        setGeneralError(
          "Cannot connect to server. Please make sure the backend is running on port 8080.",
        );
        return;
      }

      const status = error.response?.status;
      const errorData = error.response?.data;

      // Handle 409 Conflict - User already exists
      if (status === 409) {
        // Your backend returns: { timestamp, status, error, path }
        // Try to extract a meaningful message
        let errorMessage = "";

        if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (errorData?.error) {
          errorMessage = errorData.error;
        } else if (typeof errorData === "string") {
          errorMessage = errorData;
        } else {
          errorMessage = "An account with this information already exists.";
        }

        // Check what type of conflict it is
        if (errorMessage.toLowerCase().includes("email")) {
          setErrors({
            email:
              "This email address is already registered. Please login instead.",
          });
          setGeneralError("An account with this email already exists.");
        } else if (errorMessage.toLowerCase().includes("username")) {
          setErrors({
            username:
              "This username is already taken. Please choose another one.",
          });
          setGeneralError("This username is already taken.");
        } else {
          setGeneralError(errorMessage);
        }
      }
      // Handle 400 Bad Request
      else if (status === 400) {
        if (errorData?.fieldErrors) {
          const fieldErrors = {};
          Object.entries(errorData.fieldErrors).forEach(([field, message]) => {
            fieldErrors[field] = message;
          });
          setErrors(fieldErrors);
        } else if (errorData?.message) {
          const message = errorData.message.toLowerCase();
          if (
            message.includes("email") &&
            (message.includes("exists") || message.includes("already"))
          ) {
            setErrors({ email: "This email address is already registered" });
          } else if (
            message.includes("username") &&
            (message.includes("exists") || message.includes("taken"))
          ) {
            setErrors({ username: "This username is already taken" });
          } else {
            setGeneralError(errorData.message);
          }
        } else {
          setGeneralError(
            "Invalid registration data. Please check your information.",
          );
        }
      }
      // Handle 500 Server Error
      else if (status === 500) {
        setGeneralError("Server error. Please try again later.");
      }
      // Handle other errors
      else {
        setGeneralError(
          errorData?.message ||
            error?.message ||
            "Registration failed. Please try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <main className="premium-public-page">
      <div
        className="premium-container"
        style={{
          maxWidth: "560px",
          margin: "0 auto",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          paddingTop: "80px",
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
              Create Account
            </h1>
            <p
              style={{
                marginTop: "8px",
                color: "var(--app-muted)",
                fontSize: "0.875rem",
              }}
            >
              Register to access your dashboard
            </p>
          </Link>

          {successMessage && (
            <div
              className="premium-form-alert premium-form-alert-success"
              style={{ marginBottom: "20px" }}
            >
              {successMessage}
            </div>
          )}

          {generalError && (
            <div
              className="premium-form-alert premium-form-alert-error"
              style={{ marginBottom: "20px", whiteSpace: "pre-line" }}
            >
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="premium-form-grid" style={{ marginBottom: "16px" }}>
              <div className="premium-contact-form__field">
                <label className="premium-contact-form__label">
                  <span>First Name *</span>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="John"
                    className={`premium-contact-form__input ${errors.firstName && touched.firstName ? "has-error" : ""}`}
                    autoComplete="given-name"
                    disabled={submitting}
                  />
                  {errors.firstName && touched.firstName && (
                    <span className="premium-error-message">
                      {errors.firstName}
                    </span>
                  )}
                </label>
              </div>

              <div className="premium-contact-form__field">
                <label className="premium-contact-form__label">
                  <span>Last Name *</span>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Doe"
                    className={`premium-contact-form__input ${errors.lastName && touched.lastName ? "has-error" : ""}`}
                    autoComplete="family-name"
                    disabled={submitting}
                  />
                  {errors.lastName && touched.lastName && (
                    <span className="premium-error-message">
                      {errors.lastName}
                    </span>
                  )}
                </label>
              </div>
            </div>

            <div className="premium-contact-form__field">
              <label className="premium-contact-form__label">
                <span>Username *</span>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="johndoe"
                  className={`premium-contact-form__input ${errors.username && touched.username ? "has-error" : ""}`}
                  autoComplete="username"
                  disabled={submitting}
                />
                {errors.username && touched.username && (
                  <span className="premium-error-message">
                    {errors.username}
                  </span>
                )}
              </label>
            </div>

            <div className="premium-contact-form__field">
              <label className="premium-contact-form__label">
                <span>Email *</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="you@example.com"
                  className={`premium-contact-form__input ${errors.email && touched.email ? "has-error" : ""}`}
                  autoComplete="email"
                  disabled={submitting}
                />
                {errors.email && touched.email && (
                  <span className="premium-error-message">{errors.email}</span>
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
                    value={form.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Create a strong password"
                    className={`premium-contact-form__input ${errors.password && touched.password ? "has-error" : ""}`}
                    autoComplete="new-password"
                    disabled={submitting}
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
                {errors.password && touched.password && (
                  <span className="premium-error-message">
                    {errors.password}
                  </span>
                )}
              </label>
            </div>

            <div className="premium-contact-form__field">
              <label className="premium-contact-form__label">
                <span>Confirm Password *</span>
                <div className="premium-password-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Confirm your password"
                    className={`premium-contact-form__input ${errors.confirmPassword && touched.confirmPassword ? "has-error" : ""}`}
                    autoComplete="new-password"
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    className="premium-password-toggle"
                    onClick={toggleConfirmPasswordVisibility}
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.confirmPassword && touched.confirmPassword && (
                  <span className="premium-error-message">
                    {errors.confirmPassword}
                  </span>
                )}
              </label>
            </div>

            <button
              type="submit"
              className="premium-btn premium-btn-primary"
              disabled={submitting}
              style={{ width: "100%", marginTop: "24px" }}
            >
              {submitting ? "Creating account..." : "Register"}
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
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--app-primary)" }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
