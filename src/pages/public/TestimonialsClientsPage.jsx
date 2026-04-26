import { useEffect, useState } from "react";
import { publicApi } from "../../services/publicApi";

export default function TestimonialsClientsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [clientLogos, setClientLogos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const [testimonialData, logoData] = await Promise.all([
          publicApi.getTestimonials(),
          publicApi.getClientLogos(),
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
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">
        Clients & Testimonials
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
        Feedback from client engagements and trusted organizations we have
        supported.
      </p>

      {loading ? (
        <div className="mt-10 text-sm text-slate-500">
          Loading client content...
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {testimonials.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-sm text-slate-500 dark:border-slate-700">
                No testimonials available yet.
              </div>
            ) : (
              testimonials.map((item, index) => (
                <article
                  key={item.id ?? index}
                  className="rounded-2xl border border-slate-200 p-6 shadow-sm dark:border-slate-800"
                >
                  <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
                    {item.quote ??
                      item.content ??
                      item.testimonial ??
                      "No testimonial text."}
                  </p>
                  <div className="mt-4 text-sm font-semibold">
                    {item.clientName ?? item.authorName ?? "Anonymous Client"}
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="mt-14">
            <h2 className="text-lg font-semibold">Client logos</h2>

            {clientLogos.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-8 text-sm text-slate-500 dark:border-slate-700">
                No client logos available yet.
              </div>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {clientLogos.map((logo, index) => (
                  <div
                    key={logo.id ?? index}
                    className="rounded-2xl border border-slate-200 p-5 text-sm dark:border-slate-800"
                  >
                    {logo.name ?? logo.title ?? "Client"}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
