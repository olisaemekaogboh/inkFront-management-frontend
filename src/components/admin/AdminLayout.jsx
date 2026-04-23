import { Outlet } from "react-router-dom";
import PageShell from "../../layouts/PageShell";
import AdminSidebar from "../admin/AdminSidebar";
import AdminTopbar from "../admin/AdminTopbar";

export default function AdminLayout() {
  return (
    <PageShell>
      <div className="admin-shell">
        <AdminSidebar />

        <div className="admin-main">
          <AdminTopbar />
          <main className="admin-content">
            <Outlet />
          </main>
        </div>
      </div>
    </PageShell>
  );
}
