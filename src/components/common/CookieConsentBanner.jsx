import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/cookieConsent.css";

const COOKIE_KEY = "inkfront_cookie_consent";

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);

    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 900);
      return () => clearTimeout(timer);
    }
  }, []);

  function acceptCookies() {
    localStorage.setItem(
      COOKIE_KEY,
      JSON.stringify({
        accepted: true,
        acceptedAt: new Date().toISOString(),
      }),
    );

    setVisible(false);
  }

  function rejectCookies() {
    localStorage.setItem(
      COOKIE_KEY,
      JSON.stringify({
        accepted: false,
        rejectedAt: new Date().toISOString(),
      }),
    );

    setVisible(false);
  }

  if (!visible) return null;

  return (
    <section className="cookie-consent" aria-label="Cookie consent">
      <div className="cookie-consent__content">
        <strong>InkFront uses cookies</strong>

        <p>
          We use essential cookies for login, security, language preference,
          theme preference, and to improve your experience. Read our{" "}
          <Link to="/cookies">Cookies Policy</Link>.
        </p>
      </div>

      <div className="cookie-consent__actions">
        <button
          type="button"
          className="cookie-consent__btn cookie-consent__btn--ghost"
          onClick={rejectCookies}
        >
          Reject
        </button>

        <button
          type="button"
          className="cookie-consent__btn cookie-consent__btn--primary"
          onClick={acceptCookies}
        >
          Accept cookies
        </button>
      </div>
    </section>
  );
}
