import AdminCrudPage from "../../components/admin/content/AdminCrudPage";
import { adminContentConfigs } from "../../config/adminContentConfigs";

export default function AdminHeroSectionsPage() {
  return <AdminCrudPage config={adminContentConfigs.hero} />;
}
