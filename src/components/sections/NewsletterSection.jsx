import { useState } from "react";
import useLanguage from "../../hooks/useLanguage";
import newsletterService from "../../services/newsletterService";
import "./NewsletterSection.css";

// ==================== EMAIL VALIDATION ====================

function validateEmail(email) {
  const trimmed = email.trim();
  if (!trimmed) return false;

  // Strict email regex pattern
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(trimmed)) return false;

  // Additional checks
  const parts = trimmed.split("@");
  if (parts.length !== 2) return false;

  const domain = parts[1];
  if (!domain || domain.length < 3) return false;

  // Check for valid TLD (at least 2 characters after last dot)
  const domainParts = domain.split(".");
  if (domainParts.length < 2) return false;

  const tld = domainParts[domainParts.length - 1];
  if (!tld || tld.length < 2) return false;

  return true;
}

export default function NewsletterSection() {
  const { language, t } = useLanguage();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  function updateField(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
    // Reset states when user types
    if (notice) setNotice("");
    if (error) setError("");
    if (isSubscribed) setIsSubscribed(false);
  }

  // Check if form is valid
  const isFormValid = () => {
    return form.email.trim() !== "" && validateEmail(form.email);
  };

  async function handleSubmit(event) {
    event.preventDefault();

    setNotice("");
    setError("");

    // Validate email
    if (!form.email.trim()) {
      setError(t("newsletter.emailRequired", "Email address is required"));
      return;
    }

    if (!validateEmail(form.email)) {
      setError(
        t("newsletter.invalidEmail", "Please enter a valid email address"),
      );
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

      setIsSubscribed(true);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          t("newsletter.failed", "Could not subscribe. Please try again."),
      );
      setIsSubscribed(false);
    } finally {
      setLoading(false);
    }
  }

  // Get button text based on state
  const getButtonText = () => {
    if (isSubscribed) {
      return t("newsletter.subscribed", "✓ Subscribed");
    }
    if (loading) {
      return t("states.saving", "Subscribing...");
    }
    return t("forms.newsletter.subscribe", "Subscribe");
  };

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
              disabled={loading || isSubscribed}
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
              disabled={loading || isSubscribed}
              className={
                form.email &&
                !validateEmail(form.email) &&
                form.email.trim() !== ""
                  ? "newsletter-input-error"
                  : ""
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading || !isFormValid() || isSubscribed}
            className={isSubscribed ? "newsletter-btn-success" : ""}
          >
            {getButtonText()}
          </button>

          {form.email &&
            !validateEmail(form.email) &&
            form.email.trim() !== "" && (
              <p className="newsletter-section__error">
                {t(
                  "newsletter.invalidEmail",
                  "Please enter a valid email address",
                )}
              </p>
            )}

          {notice ? (
            <p className="newsletter-section__notice">{notice}</p>
          ) : null}
          {error ? <p className="newsletter-section__error">{error}</p> : null}
        </form>
      </div>
    </section>
  );
}
