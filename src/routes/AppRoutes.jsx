import { Routes, Route } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import AdminLayout from "../components/layout/AdminLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AdminRoute from "../components/auth/AdminRoute";
import HomePage from "../pages/public/HomePage";
import AboutPage from "../pages/public/AboutPage";
import ServicesPage from "../pages/public/ServicesPage";
import PortfolioListPage from "../pages/public/PortfolioListPage";
import PortfolioDetailPage from "../pages/public/PortfolioDetailPage";
import ProductsPage from "../pages/public/ProductsPage";
import ProductBlueprintPage from "../pages/public/ProductBlueprintPage";
import TestimonialsClientsPage from "../pages/public/TestimonialsClientsPage";
import ContactPage from "../pages/public/ContactPage";
import NotFoundPage from "../pages/public/NotFoundPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import LoginPage from "../pages/auth/LoginPage";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/portfolio" element={<PortfolioListPage />} />
        <Route path="/portfolio/:slug" element={<PortfolioDetailPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:slug" element={<ProductBlueprintPage />} />
        <Route path="/clients" element={<TestimonialsClientsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
