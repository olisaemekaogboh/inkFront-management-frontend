import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function RegisterPage() {
  const { register } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      window.location.assign("/admin");
    } catch (error) {
      setErrorMessage(
        error?.message ||
          error?.response?.data?.message ||
          "Registration failed. Please check your details and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <div
        className="auth-card"
        style={{ maxWidth: "560px", margin: "0 auto" }}
      >
        <div className="p-6 sm:p-8">
          <div className="text-center">
            <h1 className="text-3xl font-black tracking-tight">
              Create Account
            </h1>
            <p className="mt-2 text-sm text-muted">
              Register to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 mt-8">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <label className="admin-form-field">
                <span>First Name</span>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="app-input"
                  autoComplete="given-name"
                  required
                />
              </label>

              <label className="admin-form-field">
                <span>Last Name</span>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="app-input"
                  autoComplete="family-name"
                  required
                />
              </label>
            </div>

            <label className="admin-form-field">
              <span>Username</span>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="johndoe"
                className="app-input"
                autoComplete="username"
                minLength={3}
                required
              />
            </label>

            <label className="admin-form-field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="app-input"
                autoComplete="email"
                required
              />
            </label>

            <label className="admin-form-field">
              <span>Password</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className="app-input"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </label>

            {errorMessage && <div className="error-state">{errorMessage}</div>}

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary w-full"
            >
              {submitting ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link to="/login" className="text-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
