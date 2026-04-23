import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "../../components/common/Container";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth";
import useLanguage from "../../hooks/useLanguage";

const initialLoginState = {
  login: "",
  password: "",
};

const initialRegisterState = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
};

function resolveBackendOrigin() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

  if (!apiBaseUrl) {
    return "http://localhost:8080";
  }

  try {
    const url = new URL(apiBaseUrl);

    // If api base is like http://localhost:8080/api
    // Google OAuth entry should still be http://localhost:8080/oauth2/authorization/google
    return url.origin;
  } catch {
    return "http://localhost:8080";
  }
}

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { t } = useLanguage();

  const redirectPath = useMemo(
    () => location.state?.from?.pathname || "/admin",
    [location.state],
  );

  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState(initialLoginState);
  const [registerForm, setRegisterForm] = useState(initialRegisterState);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  function handleLoginChange(event) {
    const { name, value } = event.target;
    setLoginForm((current) => ({ ...current, [name]: value }));
  }

  function handleRegisterChange(event) {
    const { name, value } = event.target;
    setRegisterForm((current) => ({ ...current, [name]: value }));
  }

  function handleGoogleLogin() {
    const backendOrigin = resolveBackendOrigin();
    window.location.href = `${backendOrigin}/oauth2/authorization/google`;
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback("");

    try {
      await login(loginForm);
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setFeedback(error?.message || t("states.errorGeneric"));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRegisterSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback("");

    try {
      await register(registerForm);
      navigate("/admin", { replace: true });
    } catch (error) {
      setFeedback(error?.message || t("states.errorGeneric"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container className="page-section auth-page">
      <div className="auth-card">
        <div className="auth-tabs">
          <button
            type="button"
            className={mode === "login" ? "auth-tab active" : "auth-tab"}
            onClick={() => {
              setMode("login");
              setFeedback("");
            }}
          >
            {t("auth.loginTab")}
          </button>

          <button
            type="button"
            className={mode === "register" ? "auth-tab active" : "auth-tab"}
            onClick={() => {
              setMode("register");
              setFeedback("");
            }}
          >
            {t("auth.registerTab")}
          </button>
        </div>

        {mode === "login" ? (
          <form onSubmit={handleLoginSubmit} className="stack gap-sm">
            <h1>{t("auth.loginTitle")}</h1>

            <input
              name="login"
              value={loginForm.login}
              onChange={handleLoginChange}
              placeholder={t("auth.emailOrUsername")}
              required
            />

            <input
              name="password"
              type="password"
              value={loginForm.password}
              onChange={handleLoginChange}
              placeholder={t("auth.password")}
              required
            />

            <Button type="submit" disabled={submitting}>
              {submitting ? t("auth.loginSubmitting") : t("auth.loginButton")}
            </Button>

            <Button
              type="button"
              onClick={handleGoogleLogin}
              disabled={submitting}
            >
              Continue with Google
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="stack gap-sm">
            <h1>{t("auth.registerTitle")}</h1>

            <input
              name="firstName"
              value={registerForm.firstName}
              onChange={handleRegisterChange}
              placeholder={t("auth.firstName")}
              required
            />

            <input
              name="lastName"
              value={registerForm.lastName}
              onChange={handleRegisterChange}
              placeholder={t("auth.lastName")}
              required
            />

            <input
              name="username"
              value={registerForm.username}
              onChange={handleRegisterChange}
              placeholder={t("auth.username")}
              required
            />

            <input
              name="email"
              type="email"
              value={registerForm.email}
              onChange={handleRegisterChange}
              placeholder={t("auth.email")}
              required
            />

            <input
              name="password"
              type="password"
              value={registerForm.password}
              onChange={handleRegisterChange}
              placeholder={t("auth.password")}
              required
            />

            <Button type="submit" disabled={submitting}>
              {submitting
                ? t("auth.registerSubmitting")
                : t("auth.registerButton")}
            </Button>

            <Button
              type="button"
              onClick={handleGoogleLogin}
              disabled={submitting}
            >
              Continue with Google
            </Button>
          </form>
        )}

        {feedback ? <p className="auth-feedback">{feedback}</p> : null}
      </div>
    </Container>
  );
}
