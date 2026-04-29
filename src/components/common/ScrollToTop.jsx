import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();
  const previousPathRef = useRef("");

  useEffect(() => {
    const currentPath = `${pathname}${search}`;

    if (hash) {
      const target = document.querySelector(hash);

      if (target) {
        window.requestAnimationFrame(() => {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      }

      previousPathRef.current = currentPath;
      return;
    }

    if (previousPathRef.current !== currentPath) {
      window.requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      });
    }

    previousPathRef.current = currentPath;
  }, [pathname, search, hash]);

  return null;
}
