import { NavLink } from "react-router-dom";
import { adminMenuItems } from "../../config/adminResources";
import useLanguage from "../../hooks/useLanguage";

export default function AdminSidebar() {
  const { t } = useLanguage();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <h2>{t("admin.shell.title")}</h2>
        <p>{t("admin.shell.subtitle")}</p>
      </div>

      <nav className="admin-sidebar-nav">
        {adminMenuItems.map((item) => (
          <NavLink
            key={item.key}
            to={item.route}
            end={item.route === "/admin"}
            className={({ isActive }) =>
              isActive ? "admin-sidebar-link active" : "admin-sidebar-link"
            }
          >
            {t(item.labelKey)}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
