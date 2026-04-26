import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import useLanguage from "../../hooks/useLanguage";
import { publicApi } from "../../services/publicApi";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const fallbackIcons = ["🚀", "⚙️", "📊", "🎨", "💻", "📱", "🔧", "💡"];

const iconMap = {
  code: "💻",
  workflow: "⚙️",
  target: "🎯",
  "shopping-cart": "🛒",
  search: "🔎",
  layers: "🧩",
};

export default function ServicesPage() {
  const { language, t } = useLanguage();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadServices() {
      try {
        setLoading(true);
        setError("");

        const response = await publicApi.getServices({
          language: language || "EN",
          featuredOnly: false,
          page: 0,
          size: 12,
        });

        const items = Array.isArray(response?.content)
          ? response.content
          : Array.isArray(response?.data?.content)
            ? response.data.content
            : Array.isArray(response?.data)
              ? response.data
              : Array.isArray(response)
                ? response
                : [];

        if (active) {
          setServices(items);
        }
      } catch (err) {
        if (active) {
          setServices([]);
          setError(err?.message || "Failed to load services");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadServices();

    return () => {
      active = false;
    };
  }, [language]);

  const getServiceIcon = (service, index) => {
    const key = service?.iconKey || service?.icon_key || service?.icon || "";
    return iconMap[key] || fallbackIcons[index % fallbackIcons.length];
  };

  const getServiceImage = (service) => {
    return (
      service?.imageUrl ||
      service?.image_url ||
      service?.coverImageUrl ||
      service?.cover_image_url ||
      ""
    );
  };

  return (
    <div className="page">
      <main className="page__main">
        <section className="page-section bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="hero__badge">
                {t("nav.services", "Services")}
              </span>

              <h1 className="text-4xl font-bold mt-4 mb-4">
                {t("servicesPage.title", "Solutions built for growth")}
              </h1>

              <p className="text-lg text-muted">
                {t(
                  "servicesPage.description",
                  "We help brands launch products, scale operations, improve visibility, and create better digital experiences.",
                )}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            {loading ? (
              <div className="text-center py-48">
                <div className="animate-spin text-4xl mb-4">⏳</div>
                <p className="text-muted">
                  {t("states.loadingPage", "Loading services...")}
                </p>
              </div>
            ) : error ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="card p-32 text-center"
              >
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold mb-2">
                  {t("states.error", "Something went wrong")}
                </h3>
                <p className="text-muted">{error}</p>
              </motion.div>
            ) : services.length === 0 ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="text-center py-48"
              >
                <div className="text-6xl mb-4">📭</div>
                <p className="text-muted">
                  {t("servicesPage.empty", "No services available yet.")}
                </p>
              </motion.div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-3 gap-6"
              >
                {services.map((service, index) => {
                  const imageUrl = getServiceImage(service);

                  return (
                    <motion.article
                      key={service.id ?? service.slug ?? index}
                      variants={scaleIn}
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                      className="card card--glow"
                    >
                      <div className="card__media bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={service.name || service.title || "Service"}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-6xl">
                            {getServiceIcon(service, index)}
                          </span>
                        )}
                      </div>

                      <div className="card__content">
                        <span className="card__badge">
                          {service.category || t("nav.services", "Service")}
                        </span>

                        <h3 className="card__title">
                          {service.name || service.title || "Untitled Service"}
                        </h3>

                        <p className="card__description">
                          {service.shortDescription ||
                            service.short_description ||
                            service.fullDescription ||
                            service.full_description ||
                            "Service details will appear here."}
                        </p>

                        {service.slug ? (
                          <Link
                            to={`/services/${service.slug}`}
                            className="btn btn--outline btn--sm mt-4"
                          >
                            Learn more →
                          </Link>
                        ) : null}
                      </div>
                    </motion.article>
                  );
                })}
              </motion.div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
