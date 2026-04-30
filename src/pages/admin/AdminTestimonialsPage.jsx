import AdminCrudPage from "../../components/admin/content/AdminCrudPage";
import { adminContentConfigs } from "../../config/adminContentConfigs";

export default function AdminTestimonialsPage() {
  return <AdminCrudPage config={adminContentConfigs.testimonials} />;
}
