import { Outlet } from "react-router-dom";
import PageShell from "../../layouts/PageShell";

export default function AdminLayout() {
  return (
    <PageShell>
      <div className="admin-layout">
        <Outlet />
      </div>
    </PageShell>
  );
}
