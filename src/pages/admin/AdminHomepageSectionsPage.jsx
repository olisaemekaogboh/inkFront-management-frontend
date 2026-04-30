import AdminCrudPage from "../../components/admin/content/AdminCrudPage";
import { adminContentConfigs } from "../../config/adminContentConfigs";

export default function AdminHomepageSectionsPage() {
  return <AdminCrudPage config={adminContentConfigs.homepageSections} />;
}
