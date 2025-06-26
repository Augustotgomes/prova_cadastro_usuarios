import React, { JSX } from "react";
import { Spinner } from "react-bootstrap";

interface LoaderProps {
  size?: "sm" | "lg";
  spinnerSize?: "sm";
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";
  text?: string;
  overlay?: boolean;
  className?: string;
}

export function Loader({
  spinnerSize = "sm",
  variant = "primary",
  text,
  overlay = false,
  className = "",
}: LoaderProps): JSX.Element {
  const loaderContent = (
    <div
      className={`d-flex align-items-center justify-content-center ${className}`}
    >
      <Spinner
        animation="border"
        size={spinnerSize}
        variant={variant}
        role="status"
        aria-hidden="true"
      />
      {text && <span className="ms-2 text-muted">{text}</span>}
    </div>
  );

  if (overlay) {
    return (
      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          zIndex: 9999,
        }}
      >
        <div className="text-center">{loaderContent}</div>
      </div>
    );
  }

  return loaderContent;
}

interface LoadingButtonProps {
  loading: boolean;
  children: React.ReactNode;
  variant?: string;
  size?: "sm" | "lg";
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export function LoadingButton({
  loading,
  children,
  variant = "primary",
  size,
  disabled = false,
  onClick,
  type = "button",
  className = "",
}: LoadingButtonProps): JSX.Element {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${size ? `btn-${size}` : ""} ${className}`}
      disabled={loading || disabled}
      onClick={onClick}
    >
      {loading && (
        <Spinner
          animation="border"
          size="sm"
          className="me-2"
          role="status"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}

interface LoadingOverlayProps {
  loading: boolean;
  children: React.ReactNode;
  text?: string;
}

export function LoadingOverlay({
  loading,
  children,
  text = "Carregando...",
}: LoadingOverlayProps): JSX.Element {
  return (
    <div className="position-relative">
      {children}
      {loading && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            zIndex: 10,
          }}
        >
          <Loader text={text} size="lg" />
        </div>
      )}
    </div>
  );
}
