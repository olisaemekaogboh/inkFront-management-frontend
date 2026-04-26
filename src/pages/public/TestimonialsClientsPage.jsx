import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useLanguage from "../../hooks/useLanguage";
import { publicApi } from "../../services/publicApi";
import "../../styles/publicPremium.css";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function normalizeList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.content)) return response.content;
  if (Array.isArray(response?.data?.content)) return response.data.content;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.items)) return response.items;
  return [];
}

function text(...values) {
  return (
    values.find((value) => typeof value === "string" && value.trim()) || ""
  );
}

export default function TestimonialsClientsPage() {
  const { language, t } = useLanguage();

  const [testimonials, setTestimonials] = useState([]);
  const [clientLogos, setClientLogos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadClientContent() {
      try {
        setLoading(true);

        const [testimonialData, logoData] = await Promise.all([
          publicApi.getTestimonials({
            language: language || "EN",
            featuredOnly: false,
            page: 0,
            size: 12,
          }),
          publicApi.getClientLogos({
            language: language || "EN",
            featuredOnly: false,
            page: 0,
            size: 12,
          }),
        ]);

        if (active) {
          setTestimonials(normalizeList(testimonialData));
          setClientLogos(normalizeList(logoData));
        }
      } catch {
        if (active) {
          setTestimonials([]);
          setClientLogos([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadClientContent();

    return () => {
      active = false;
    };
  }, [language]);

  return (
    <main className="premium-public-page">
      <section className="premium-hero premium-compact-hero">
        <div className="premium-container">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="premium-page-intro"
          >
            <span className="premium-eyebrow">
              {t("nav.clients", "Clients")}
            </span>

            <h1>
              {t(
                "clientsPage.title",
                "Client stories, trust signals, and business proof",
              )}
            </h1>

            <p>
              {t(
                "clientsPage.description",
                "Feedback from client engagements and organizations supported with websites, digital products, and business systems.",
              )}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="premium-section premium-testimonial-section">
        <div className="premium-container">
          <div className="premium-section-head">
            <span className="premium-eyebrow">Testimonials</span>
            <h2>What clients say about working with InkFront</h2>
            <p>
              Real feedback should help future clients understand the quality,
              clarity, and professionalism of your work.
            </p>
          </div>

          {loading ? (
            <div className="premium-loading">Loading client content...</div>
          ) : testimonials.length === 0 ? (
            <div className="premium-empty-card">
              No testimonials available yet.
            </div>
          ) : (
            <div className="premium-testimonial-grid premium-testimonial-grid-large">
              {testimonials.map((item, index) => {
                const quote = text(
                  item.quote,
                  item.message,
                  item.content,
                  "No testimonial text.",
                );

                const name = text(
                  item.clientName,
                  item.name,
                  item.author,
                  "Anonymous Client",
                );

                const roleLine = [item.clientRole, item.role, item.organization]
                  .filter(Boolean)
                  .join(" • ");

                const avatarUrl = text(
                  item.avatarUrl,
                  item.imageUrl,
                  item.photoUrl,
                );

                return (
                  <motion.article
                    key={item.id ?? index}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: index * 0.04 }}
                    viewport={{ once: true }}
                    className="premium-testimonial-card"
                  >
                    <div className="premium-quote-mark">“</div>

                    <p>“{quote}”</p>

                    <div className="premium-person">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={name}
                          className="premium-avatar"
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="premium-avatar premium-avatar-fallback">
                          {name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <strong>{name}</strong>
                        <span>{roleLine || "Client"}</span>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="premium-logo-strip premium-logo-strip-spacious">
        <div className="premium-container">
          <span>Trusted organizations and client brands</span>

          {loading ? null : clientLogos.length === 0 ? (
            <div className="premium-empty-card">
              No client logos available yet.
            </div>
          ) : (
            <div className="premium-logo-grid">
              {clientLogos.map((logo, index) => {
                const name = text(
                  logo.name,
                  logo.clientName,
                  `Client ${index + 1}`,
                );
                const logoUrl = text(logo.logoUrl, logo.imageUrl);

                const content = logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={name}
                    className="premium-logo-img"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <strong>{name}</strong>
                );

                if (logo.websiteUrl) {
                  return (
                    <a
                      key={logo.id ?? index}
                      href={logo.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="premium-logo-card"
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <div key={logo.id ?? index} className="premium-logo-card">
                    {content}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="premium-cta">
        <div className="premium-container premium-cta-inner">
          <span className="premium-eyebrow">Join the next success story</span>
          <h2>Let’s build a professional platform for your brand.</h2>
          <p>
            Your website should communicate trust, show proof, and turn visitors
            into real conversations.
          </p>
        </div>
      </section>
    </main>
  );
}
