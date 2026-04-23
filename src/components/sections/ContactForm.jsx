import { useState } from "react";
import Button from "../common/Button";
import { contactService } from "../../services/contactService";
import useLanguage from "../../hooks/useLanguage";

const initialState = {
  fullName: "",
  email: "",
  phoneNumber: "",
  companyName: "",
  subject: "",
  message: "",
};

export default function ContactForm() {
  const { language, t } = useLanguage();
  const [form, setForm] = useState(initialState);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback("");

    try {
      await contactService.submitContactForm({
        ...form,
        preferredLanguage: language,
      });
      setFeedback(t("forms.contact.success"));
      setForm(initialState);
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="stack gap-sm">
      <input
        name="fullName"
        value={form.fullName}
        onChange={handleChange}
        placeholder={t("forms.contact.fullName")}
        required
      />

      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder={t("forms.contact.email")}
        required
      />

      <input
        name="phoneNumber"
        value={form.phoneNumber}
        onChange={handleChange}
        placeholder={t("forms.contact.phoneNumber")}
      />

      <input
        name="companyName"
        value={form.companyName}
        onChange={handleChange}
        placeholder={t("forms.contact.companyName")}
      />

      <input
        name="subject"
        value={form.subject}
        onChange={handleChange}
        placeholder={t("forms.contact.subject")}
      />

      <textarea
        name="message"
        value={form.message}
        onChange={handleChange}
        placeholder={t("forms.contact.message")}
        rows="6"
        required
      />

      <Button type="submit" disabled={submitting}>
        {submitting ? t("common.loading") : t("common.sendMessage")}
      </Button>

      {feedback ? <p className="form-feedback">{feedback}</p> : null}
    </form>
  );
}
