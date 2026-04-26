import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function PublicLayout() {
  const { authenticated, user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    [
      "text-sm font-medium transition",
      isActive
        ? "text-blue-600"
        : "text-slate-700 hover:text-blue-600 dark:text-slate-300",
    ].join(" ");

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-xl font-bold">
            Agency
          </Link>

          <nav className="flex items-center gap-5">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/about" className={linkClass}>
              About
            </NavLink>
            <NavLink to="/services" className={linkClass}>
              Services
            </NavLink>
            <NavLink to="/portfolio" className={linkClass}>
              Portfolio
            </NavLink>
            <NavLink to="/products" className={linkClass}>
              Products
            </NavLink>
            <NavLink to="/clients" className={linkClass}>
              Clients
            </NavLink>

            {!loading && !authenticated ? (
              <>
                <NavLink to="/login" className={linkClass}>
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
                >
                  Register
                </NavLink>
              </>
            ) : null}

            {!loading && authenticated ? (
              <>
                <NavLink
                  to="/admin"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Dashboard
                </NavLink>

                <span className="hidden max-w-[180px] truncate text-sm text-slate-500 dark:text-slate-400 sm:inline">
                  {user?.displayName || user?.email}
                </span>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/40"
                >
                  Logout
                </button>
              </>
            ) : null}
          </nav>
        </div>
      </header>

      <Outlet />
    </div>
  );
}
