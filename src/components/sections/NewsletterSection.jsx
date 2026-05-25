import { useState } from "react";
import useLanguage from "../../hooks/useLanguage";
import newsletterService from "../../services/newsletterService";
import "./NewsletterSection.css";

export default function NewsletterSection() {
  const { language, t } = useLanguage();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  function updateField(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setNotice("");
    setError("");

    if (!form.email.trim()) {
      setError(t("newsletter.emailRequired", "Email address is required"));
      return;
    }

    setLoading(true);

    try {
      await newsletterService.subscribe({
        fullName: form.fullName.trim() || null,
        email: form.email.trim(),
        language: language || "EN",
      });

      setNotice(
        t(
          "newsletter.success",
          "You have successfully subscribed to InkFront updates.",
        ),
      );

      setForm({
        fullName: "",
        email: "",
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          t("newsletter.failed", "Could not subscribe. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="newsletter-section">
      <div className="newsletter-section__inner">
        <div className="newsletter-section__copy">
          <span className="newsletter-section__eyebrow">
            {t("sections.newsletter.eyebrow", "Stay connected")}
          </span>

          <h2>
            {t(
              "sections.newsletter.title",
              "Stay close to what we are building",
            )}
          </h2>

          <p>
            {t(
              "sections.newsletter.description",
              "Get thoughtful product and software insights in your inbox.",
            )}
          </p>
        </div>

        <form className="newsletter-section__form" onSubmit={handleSubmit}>
          <div className="newsletter-section__fields">
            <input
              type="text"
              value={form.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              placeholder={t("forms.newsletter.namePlaceholder", "Your name")}
            />

            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder={t(
                "forms.newsletter.emailPlaceholder",
                "Enter your email",
              )}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading
              ? t("states.saving", "Subscribing...")
              : t("forms.newsletter.subscribe", "Subscribe")}
          </button>

          {notice ? (
            <p className="newsletter-section__notice">{notice}</p>
          ) : null}
          {error ? <p className="newsletter-section__error">{error}</p> : null}
        </form>
      </div>
    </section>
  );
}
