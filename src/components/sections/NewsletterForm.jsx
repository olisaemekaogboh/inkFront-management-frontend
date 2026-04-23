import { useState } from "react";
import Button from "../common/Button";
import { newsletterService } from "../../services/newsletterService";
import useLanguage from "../../hooks/useLanguage";

export default function NewsletterForm() {
  const { language, t } = useLanguage();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      await newsletterService.subscribe({ email, language });
      setMessage(t("forms.newsletter.success"));
      setEmail("");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="newsletter-inline-form">
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder={t("forms.newsletter.emailPlaceholder")}
        required
      />
      <Button type="submit" disabled={submitting}>
        {submitting ? t("common.loading") : t("common.subscribe")}
      </Button>
      {message ? <p className="form-feedback">{message}</p> : null}
    </form>
  );
}
