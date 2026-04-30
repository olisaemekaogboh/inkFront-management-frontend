import AdminCrudPage from "../../components/admin/content/AdminCrudPage";
import { adminContentConfigs } from "../../config/adminContentConfigs";

export default function AdminServicesPage() {
  return <AdminCrudPage config={adminContentConfigs.services} />;
}
