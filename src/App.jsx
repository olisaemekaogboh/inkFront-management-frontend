import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import PublicLayout from "./components/layout/PublicLayout";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import AdminContentManagerPage from "./pages/admin/AdminContentManagerPage";
import AdminContactMessagesPage from "./pages/admin/AdminContactMessagesPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminBlogPostsPage from "./pages/admin/AdminBlogPostsPage";

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
import NotFoundPage from "./pages/public/NotFoundPage";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginSuccessPage from "./pages/auth/LoginSuccessPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PublicLayout />}>
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

          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/success" element={<LoginSuccessPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
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

          <Route
            path="hero-sections"
            element={
              <AdminContentManagerPage
                type="hero-sections"
                title="Hero Sections"
                description="Create homepage hero content."
              />
            }
          />

          <Route
            path="homepage-sections"
            element={
              <AdminContentManagerPage
                type="homepage-sections"
                title="Homepage Sections"
                description="Manage reusable homepage blocks."
              />
            }
          />

          <Route
            path="services"
            element={
              <AdminContentManagerPage
                type="services"
                title="Services"
                description="Create and manage public services."
              />
            }
          />

          <Route
            path="portfolio"
            element={
              <AdminContentManagerPage
                type="portfolio"
                title="Portfolio"
                description="Create and manage portfolio projects."
              />
            }
          />

          <Route
            path="products"
            element={
              <AdminContentManagerPage
                type="products"
                title="Product Blueprints"
                description="Create and manage product blueprint pages."
              />
            }
          />

          <Route
            path="testimonials"
            element={
              <AdminContentManagerPage
                type="testimonials"
                title="Testimonials"
                description="Create and manage client testimonials."
              />
            }
          />

          <Route
            path="client-logos"
            element={
              <AdminContentManagerPage
                type="client-logos"
                title="Client Logos"
                description="Create and manage trusted client logos."
              />
            }
          />

          <Route
            path="clients"
            element={
              <AdminContentManagerPage
                type="testimonials"
                title="Clients"
                description="Manage testimonials shown on the clients page."
              />
            }
          />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}
