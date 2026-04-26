import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function LoginSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshCurrentUser } = useAuth();

  useEffect(() => {
    const finishLogin = async () => {
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
    };

    finishLogin();
  }, [navigate, refreshCurrentUser, searchParams]);

  return (
    <div className="auth-page">
      <div
        className="container d-flex align-center justify-center"
        style={{ minHeight: "calc(100vh - 200px)" }}
      >
        <div className="card p-32 text-center" style={{ maxWidth: "480px" }}>
          <h1 className="text-2xl font-bold mb-12">Login successful</h1>
          <p className="text-sm text-muted">Verifying your session...</p>
        </div>
      </div>
    </div>
  );
}
