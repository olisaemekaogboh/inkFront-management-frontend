import { useEffect, useState } from "react";
import useLanguage from "../../hooks/useLanguage";
import { publicApi } from "../../services/publicApi";

export default function TestimonialsClientsPage() {
  const { language } = useLanguage();

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
          setTestimonials(
            Array.isArray(testimonialData) ? testimonialData : [],
          );
          setClientLogos(Array.isArray(logoData) ? logoData : []);
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
    <div className="page">
      <main className="page__main">
        <section className="page-section bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <span className="hero__badge">Testimonials</span>
              <h1 className="text-3xl font-bold mt-16 mb-12">
                Clients & Testimonials
              </h1>
              <p className="text-md text-soft">
                Feedback from client engagements and trusted organizations we
                have supported.
              </p>
            </div>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            {loading ? (
              <div className="loading">Loading client content...</div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-24">
                  {testimonials.length === 0 ? (
                    <div className="empty-state col-span-2">
                      No testimonials available yet.
                    </div>
                  ) : (
                    testimonials.map((item, index) => (
                      <article key={item.id ?? index} className="card p-24">
                        <div className="text-6xl mb-16 opacity-30">"</div>
                        <p className="text-md leading-relaxed text-soft mb-20">
                          “{item.quote ?? "No testimonial text."}”
                        </p>

                        <div className="border-t border-border pt-16">
                          <div className="font-semibold">
                            {item.clientName ?? "Anonymous Client"}
                          </div>
                          <div className="text-xs text-muted mt-4">
                            {[item.clientRole, item.organization]
                              .filter(Boolean)
                              .join(" • ")}
                          </div>
                        </div>
                      </article>
                    ))
                  )}
                </div>

                <div className="mt-48">
                  <h2 className="text-lg font-bold mb-24">Client logos</h2>

                  {clientLogos.length === 0 ? (
                    <div className="empty-state">
                      No client logos available yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-16">
                      {clientLogos.map((logo, index) => (
                        <a
                          key={logo.id ?? index}
                          href={logo.websiteUrl || "#"}
                          target={logo.websiteUrl ? "_blank" : undefined}
                          rel={logo.websiteUrl ? "noreferrer" : undefined}
                          className="card p-20 text-center text-decoration-none"
                        >
                          {logo.logoUrl ? (
                            <img
                              src={logo.logoUrl}
                              alt={logo.name || "Client logo"}
                              className="mx-auto h-12 max-w-full object-contain"
                              loading="lazy"
                            />
                          ) : (
                            <span className="text-muted">
                              {logo.name ?? "Client"}
                            </span>
                          )}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
