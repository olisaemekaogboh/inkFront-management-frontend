import { useEffect, useState } from "react";
import useLanguage from "../../hooks/useLanguage";
import { publicApi } from "../../services/publicApi";

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
          language,
          featuredOnly: false,
          page: 0,
          size: 12,
        });

        const items =
          response?.content ||
          response?.data?.content ||
          response?.data ||
          response ||
          [];

        if (active) {
          setServices(Array.isArray(items) ? items : []);
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

  return (
    <main className="page-shell">
      <section className="page-header">
        <div className="container">
          <div className="page-header-content">
            <span className="section-eyebrow">
              {t("nav.services", "Services")}
            </span>

            <h1>{t("servicesPage.title", "Solutions built for growth")}</h1>

            <p>
              {t(
                "servicesPage.description",
                "We help brands launch products, scale operations, improve visibility, and create better digital experiences.",
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          {loading ? (
            <div className="loading">
              {t("states.loadingPage", "Loading services...")}
            </div>
          ) : error ? (
            <div className="error-state-card">
              <h3>{t("states.error", "Something went wrong")}</h3>
              <p>{error}</p>
            </div>
          ) : services.length === 0 ? (
            <div className="empty-state">
              {t("servicesPage.empty", "No services available yet.")}
            </div>
          ) : (
            <div className="grid grid-3">
              {services.map((service, index) => (
                <article
                  key={service.id ?? service.slug ?? index}
                  className="card premium-card"
                >
                  {service.imageUrl ? (
                    <div className="card-media">
                      <img
                        src={service.imageUrl}
                        alt={service.title || service.name || "Service"}
                      />
                    </div>
                  ) : null}

                  <div className="card-content">
                    <span className="card-meta">
                      {service.category || t("nav.services", "Service")}
                    </span>

                    <h3>
                      {service.title || service.name || "Untitled Service"}
                    </h3>

                    <p>
                      {service.shortDescription ||
                        service.description ||
                        "Service details will appear here."}
                    </p>

                    {service.priceFrom ? (
                      <p className="mt-3">
                        <strong>
                          {t("common.from", "From")} {service.priceFrom}
                        </strong>
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
