import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { authService } from "../../services/authService";
import "../../styles/publicPremium.css";

export default function LoginSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshCurrentUser, isAuthenticated, user, loading } = useAuth();
  const [error, setError] = useState("");
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    async function handleOAuthCallback() {
      if (attempted) return;
      setAttempted(true);

      // Check for error in URL params
      const errorParam = searchParams.get("error");
      if (errorParam) {
        setError(decodeURIComponent(errorParam));
        setTimeout(
          () =>
            navigate("/login", {
              replace: true,
              state: { error: decodeURIComponent(errorParam) },
            }),
          3000,
        );
        return;
      }

      // Check for token in URL (if backend sends it directly)
      const token = searchParams.get("token");
      const refreshToken = searchParams.get("refreshToken");

      if (token) {
        localStorage.setItem("auth_token", token);
        if (refreshToken)
          localStorage.setItem("auth_refresh_token", refreshToken);
      }

      try {
        // Try to refresh the user session
        const refreshedUser = await refreshCurrentUser();

        if (refreshedUser || isAuthenticated) {
          const userRoles = refreshedUser?.roles || user?.roles || [];
          const isAdmin = userRoles.some(
            (role) =>
              role === "ADMIN" ||
              role === "ROLE_ADMIN" ||
              role === "SUPER_ADMIN" ||
              role === "ROLE_SUPER_ADMIN",
          );

          if (isAdmin) {
            navigate("/admin", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
          return;
        }

        // If not authenticated, try to get user directly
        const meResponse = await authService.me();
        if (meResponse?.authenticated && meResponse?.data) {
          // Manually set user
          localStorage.setItem("auth_user", JSON.stringify(meResponse.data));
          localStorage.setItem("auth_authenticated", "true");

          const userRoles = meResponse.data.roles || [];
          const isAdmin =
            userRoles.includes("ADMIN") || userRoles.includes("ROLE_ADMIN");

          if (isAdmin) {
            navigate("/admin", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
          return;
        }

        // If all fails, redirect to login
        navigate("/login", {
          replace: true,
          state: { error: "Login failed. Please try again." },
        });
      } catch (err) {
        console.error("OAuth callback error:", err);
        setError("Failed to verify login. Please try again.");
        setTimeout(
          () =>
            navigate("/login", {
              replace: true,
              state: { error: "Login verification failed. Please try again." },
            }),
          3000,
        );
      }
    }

    if (!loading) {
      handleOAuthCallback();
    }
  }, [
    navigate,
    refreshCurrentUser,
    searchParams,
    isAuthenticated,
    user,
    loading,
    attempted,
  ]);

  if (error) {
    return (
      <main className="premium-public-page">
        <section
          className="premium-container"
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            paddingTop: "80px",
          }}
        >
          <div
            className="premium-contact-panel"
            style={{
              width: "min(420px, 100%)",
              textAlign: "center",
              padding: "42px 32px",
            }}
          >
            <div
              className="premium-form-alert premium-form-alert-error"
              style={{ marginBottom: "20px" }}
            >
              {error}
            </div>
            <p>Redirecting to login page...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="premium-public-page">
      <section
        className="premium-container"
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          paddingTop: "80px",
        }}
      >
        <div
          className="premium-contact-panel"
          style={{
            width: "min(420px, 100%)",
            textAlign: "center",
            padding: "42px 32px",
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              margin: "0 auto 18px",
              borderRadius: "999px",
              border: "4px solid rgba(37, 99, 235, 0.15)",
              borderTopColor: "var(--app-primary, #2563eb)",
              animation: "inkfrontSpin 0.8s linear infinite",
            }}
          />
          <span className="premium-eyebrow">Signing you in</span>
          <h1 style={{ margin: "18px 0 10px", fontSize: "1.8rem" }}>
            Preparing your dashboard
          </h1>
          <p style={{ color: "var(--app-muted)" }}>
            Please wait while we verify your secure session.
          </p>
        </div>
      </section>
      <style>{`@keyframes inkfrontSpin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}
