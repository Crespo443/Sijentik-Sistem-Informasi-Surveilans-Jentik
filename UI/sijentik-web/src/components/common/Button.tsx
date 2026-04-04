import React from "react";
import { Link } from "react-router-dom";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

type BaseProps = {
  variant?: ButtonVariant;
  icon?: string;
  children: React.ReactNode;
  className?: string;
  href?: string;
};

// Combining button and anchor HTML props for maximum flexibility
type ButtonProps = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

export const Button = ({
  variant = "primary",
  icon,
  children,
  className = "",
  href,
  ...props
}: ButtonProps) => {
  const baseClasses =
    "flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "bg-primary text-white hover:bg-primary-dark shadow-sm ring-1 ring-primary/50 focus:ring-primary",
    secondary:
      "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-400",
    danger: "bg-danger text-white hover:bg-red-600 shadow-sm focus:ring-danger",
    ghost:
      "bg-transparent text-primary hover:bg-primary/10 focus:ring-primary text-xs !px-2 !py-1",
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    if (href.startsWith("/")) {
      return (
        <Link to={href} className={combinedClasses}>
          {icon ? (
            <span className="material-symbols-outlined text-[18px]">
              {icon}
            </span>
          ) : null}
          {children}
        </Link>
      );
    }

    return (
      <a
        href={href}
        className={combinedClasses}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {icon ? (
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        ) : null}
        {children}
      </a>
    );
  }

  return (
    <button
      className={combinedClasses}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {icon ? (
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};
