import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface RouteTransitionProps {
  children: ReactNode;
}

export default function RouteTransition({ children }: RouteTransitionProps) {
  const location = useLocation();

  return (
    <div
      key={`${location.pathname}${location.search}`}
      className="animate-fade-in"
    >
      {children}
    </div>
  );
}
