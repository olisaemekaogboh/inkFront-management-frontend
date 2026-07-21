import { useState } from "react";
import Button from "../common/Button";
import { newsletterService } from "../../services/newsletterService";
import useLanguage from "../../hooks/useLanguage";

// ==================== EMAIL VALIDATION ====================

function validateEmail(email) {
  const trimmed = email.trim();
  if (!trimmed) return false;

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(trimmed)) return false;

  const parts = trimmed.split("@");
  if (parts.length !== 2) return false;

  const domain = parts[1];
  if (!domain || domain.length < 3) return false;

  const domainParts = domain.split(".");
  if (domainParts.length < 2) return false;

  const tld = domainParts[domainParts.length - 1];
  if (!tld || tld.length < 2) return false;

  return true;
}

export default function NewsletterForm() {
  const { language, t } = useLanguage();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    if (message) setMessage("");
    if (isSubscribed) setIsSubscribed(false);
  };

  const isFormValid = () => {
    return email.trim() !== "" && validateEmail(email);
  };

  async function handleSubmit(event) {
    event.preventDefault();

    // Validate email
    if (!email.trim()) {
      setMessage(t("forms.newsletter.emailRequired", "Email is required"));
      return;
    }

    if (!validateEmail(email)) {
      setMessage(
        t(
          "forms.newsletter.invalidEmail",
          "Please enter a valid email address",
        ),
      );
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      await newsletterService.subscribe({ email, language });
      setMessage(t("forms.newsletter.success", "✓ Subscription successful!"));
      setEmail("");
      setIsSubscribed(true);
    } catch (error) {
      setMessage(
        error?.response?.data?.message ||
          error?.message ||
          t("forms.newsletter.error", "Subscription failed. Please try again."),
      );
      setIsSubscribed(false);
    } finally {
      setSubmitting(false);
    }
  }

  // Get button text based on state
  const getButtonText = () => {
    if (isSubscribed) {
      return t("forms.newsletter.subscribed", "✓ Subscribed");
    }
    if (submitting) {
      return t("common.loading", "Loading...");
    }
    return t("common.subscribe", "Subscribe");
  };

  return (
    <form onSubmit={handleSubmit} className="newsletter-inline-form">
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder={t("forms.newsletter.emailPlaceholder", "Enter your email")}
        required
        disabled={submitting || isSubscribed}
        className={
          email && !validateEmail(email) && email.trim() !== ""
            ? "newsletter-input-error"
            : ""
        }
      />

      <Button
        type="submit"
        disabled={submitting || !isFormValid() || isSubscribed}
        className={isSubscribed ? "btn-success" : ""}
      >
        {getButtonText()}
      </Button>

      {email && !validateEmail(email) && email.trim() !== "" && (
        <p className="form-feedback error">
          {t(
            "forms.newsletter.invalidEmail",
            "Please enter a valid email address",
          )}
        </p>
      )}

      {message ? (
        <p
          className={`form-feedback ${message.includes("✓") ? "success" : "error"}`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
