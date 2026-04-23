import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PageShell from "../../layouts/PageShell";

export default function PublicLayout() {
  return (
    <PageShell>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </PageShell>
  );
}
