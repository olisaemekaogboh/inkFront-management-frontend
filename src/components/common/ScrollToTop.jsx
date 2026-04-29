import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();
  const previousPathRef = useRef(pathname);

  useEffect(() => {
    const pathChanged = previousPathRef.current !== pathname;
    previousPathRef.current = pathname;

    if (hash) {
      const id = hash.replace("#", "");

      requestAnimationFrame(() => {
        const element = document.getElementById(id);

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });

      return;
    }

    if (pathChanged) {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      });
    }
  }, [pathname, search, hash]);

  return null;
}
