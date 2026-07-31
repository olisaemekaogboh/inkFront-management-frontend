import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Smooth scroll to anchor links
    if (hash) {
      const element = document.querySelector(hash);

      if (element) {
        requestAnimationFrame(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      }

      return;
    }

    // Preserve scroll position when navigating Back/Forward
    if (navigationType === "POP") {
      return;
    }

    // Scroll instantly to top on normal navigation
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname, hash, navigationType]);

  return null;
}
