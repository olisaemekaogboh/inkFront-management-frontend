import AdminCrudPage from "../../components/admin/content/AdminCrudPage";
import { adminContentConfigs } from "../../config/adminContentConfigs";

export default function AdminPortfolioPage() {
  return <AdminCrudPage config={adminContentConfigs.portfolio} />;
}
