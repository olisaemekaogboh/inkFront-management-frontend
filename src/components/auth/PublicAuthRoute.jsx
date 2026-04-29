import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function PublicAuthRoute({ children }) {
  const { user, authenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <main className="premium-public-page">
        <section className="premium-section">
          <div className="premium-container">
            <div className="premium-loading premium-loading-modern">
              <span className="premium-loading-dot" />
              Loading InkFront...
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!authenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname || "/" }}
      />
    );
  }

  return children;
}
