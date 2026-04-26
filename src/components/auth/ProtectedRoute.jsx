import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, authenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          Checking your session...
        </div>
      </section>
    );
  }

  if (!authenticated && !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
