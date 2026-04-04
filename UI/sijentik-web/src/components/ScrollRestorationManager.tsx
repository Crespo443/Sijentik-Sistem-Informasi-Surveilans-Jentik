import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const keyFor = (path: string, search: string) => `scroll:${path}${search}`;

export default function ScrollRestorationManager() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    const key = keyFor(location.pathname, location.search);
    const saved = sessionStorage.getItem(key);

    if (navigationType === "POP" && saved) {
      window.scrollTo(0, Number(saved));
    } else {
      window.scrollTo(0, 0);
    }

    return () => {
      sessionStorage.setItem(key, String(window.scrollY));
    };
  }, [location.pathname, location.search, navigationType]);

  return null;
}
