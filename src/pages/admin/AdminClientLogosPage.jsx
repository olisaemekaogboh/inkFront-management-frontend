import AdminCrudPage from "../../components/admin/content/AdminCrudPage";
import { adminContentConfigs } from "../../config/adminContentConfigs";

export default function AdminClientLogosPage() {
  return <AdminCrudPage config={adminContentConfigs.clients} />;
}
