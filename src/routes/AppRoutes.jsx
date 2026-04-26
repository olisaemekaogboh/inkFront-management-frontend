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
import AdminResourcePage from "../pages/admin/AdminResourcePage";
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
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route
              path="services"
              element={<AdminResourcePage resourceKey="services" />}
            />
            <Route
              path="portfolio-projects"
              element={<AdminResourcePage resourceKey="portfolioProjects" />}
            />
            <Route
              path="product-blueprints"
              element={<AdminResourcePage resourceKey="productBlueprints" />}
            />
            <Route
              path="testimonials"
              element={<AdminResourcePage resourceKey="testimonials" />}
            />
            <Route
              path="client-logos"
              element={<AdminResourcePage resourceKey="clientLogos" />}
            />
            <Route
              path="homepage-sections"
              element={<AdminResourcePage resourceKey="homepageSections" />}
            />
            <Route
              path="contact-submissions"
              element={<AdminResourcePage resourceKey="contactSubmissions" />}
            />
            <Route
              path="newsletter-subscribers"
              element={
                <AdminResourcePage resourceKey="newsletterSubscribers" />
              }
            />
            <Route
              path="translations"
              element={<AdminResourcePage resourceKey="translations" />}
            />
            <Route
              path="site-settings"
              element={<AdminResourcePage resourceKey="siteSettings" />}
            />
            <Route
              path="navigation-items"
              element={<AdminResourcePage resourceKey="navigationItems" />}
            />
            <Route
              path="social-links"
              element={<AdminResourcePage resourceKey="socialLinks" />}
            />
            <Route
              path="media-assets"
              element={<AdminResourcePage resourceKey="mediaAssets" />}
            />
            <Route
              path="faqs"
              element={<AdminResourcePage resourceKey="faqs" />}
            />
            <Route
              path="categories"
              element={<AdminResourcePage resourceKey="categories" />}
            />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
