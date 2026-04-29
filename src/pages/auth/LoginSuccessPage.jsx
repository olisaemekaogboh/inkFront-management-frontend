import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "../../styles/publicPremium.css";

export default function LoginSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshCurrentUser } = useAuth();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    async function finishLogin() {
      try {
        const user = await refreshCurrentUser();

        if (user) {
          navigate("/admin", { replace: true });
          return;
        }

        navigate("/login", {
          replace: true,
          state: {
            error:
              searchParams.get("error") ||
              "Google login completed but session could not be verified.",
          },
        });
      } catch {
        navigate("/login", {
          replace: true,
          state: {
            error: "Login verification failed. Please try again.",
          },
        });
      }
    }

    finishLogin();
  }, [navigate, refreshCurrentUser, searchParams]);

  return (
    <main className="premium-public-page">
      <section
        className="premium-container"
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
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

          <h1
            style={{
              margin: "18px 0 10px",
              fontSize: "1.8rem",
              letterSpacing: "-0.04em",
            }}
          >
            Preparing your dashboard
          </h1>

          <p style={{ color: "var(--app-muted)" }}>
            Please wait while we verify your secure session.
          </p>
        </div>
      </section>

      <style>
        {`
          @keyframes inkfrontSpin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </main>
  );
}
