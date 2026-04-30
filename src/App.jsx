import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import PublicLayout from "./components/layout/PublicLayout";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicAuthRoute from "./components/auth/PublicAuthRoute";

import AdminContentManagerPage from "./pages/admin/AdminContentManagerPage";
import AdminContactMessagesPage from "./pages/admin/AdminContactMessagesPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminBlogPostsPage from "./pages/admin/AdminBlogPostsPage";
import AdminNewsletterPage from "./pages/admin/AdminNewsletterPage";
import AdminServicesPage from "./pages/admin/AdminServicesPage";
import AdminClientLogosPage from "./pages/admin/AdminClientLogosPage";
import AdminPortfolioPage from "./pages/admin/AdminPortfolioPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminTestimonialsPage from "./pages/admin/AdminTestimonialsPage";
import AdminHeroSectionsPage from "./pages/admin/AdminHeroSectionsPage";
import AdminHomepageSectionsPage from "./pages/admin/AdminHomepageSectionsPage";
import HomePage from "./pages/public/HomePage";
import AboutPage from "./pages/public/AboutPage";
import ContactPage from "./pages/public/ContactPage";
import ServicesPage from "./pages/public/ServicesPage";
import ServiceDetailPage from "./pages/public/ServiceDetailPage";
import PortfolioListPage from "./pages/public/PortfolioListPage";
import PortfolioDetailPage from "./pages/public/PortfolioDetailPage";
import ProductsPage from "./pages/public/ProductsPage";
import ProductBlueprintPage from "./pages/public/ProductBlueprintPage";
import TestimonialsClientsPage from "./pages/public/TestimonialsClientsPage";
import BlogListPage from "./pages/public/BlogListPage";
import BlogDetailPage from "./pages/public/BlogDetailPage";
import TermsPage from "./pages/public/TermsPage";
import PrivacyPolicyPage from "./pages/public/PrivacyPolicyPage";
import CookiesPolicyPage from "./pages/public/CookiesPolicyPage";
import NotFoundPage from "./pages/public/NotFoundPage";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginSuccessPage from "./pages/auth/LoginSuccessPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/success" element={<LoginSuccessPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          element={
            <PublicAuthRoute>
              <PublicLayout />
            </PublicAuthRoute>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />

          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />

          <Route path="/portfolio" element={<PortfolioListPage />} />
          <Route path="/portfolio/:slug" element={<PortfolioDetailPage />} />

          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductBlueprintPage />} />

          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />

          <Route path="/clients" element={<TestimonialsClientsPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/cookies" element={<CookiesPolicyPage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route
            path="contact-messages"
            element={<AdminContactMessagesPage />}
          />
          <Route path="blog-posts" element={<AdminBlogPostsPage />} />
          <Route path="newsletter" element={<AdminNewsletterPage />} />

          <Route path="services" element={<AdminServicesPage />} />
          <Route path="client-logos" element={<AdminClientLogosPage />} />
          <Route path="clients" element={<AdminClientLogosPage />} />
          <Route path="portfolio" element={<AdminPortfolioPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="testimonials" element={<AdminTestimonialsPage />} />
          <Route path="hero-sections" element={<AdminHeroSectionsPage />} />

          <Route
            path="homepage-sections"
            element={<AdminHomepageSectionsPage />}
          />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}
