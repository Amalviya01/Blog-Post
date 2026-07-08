import { Link } from "react-router-dom";
import styles from "./Logo.module.scss";

export default function Logo({ variant = "dark" }) {
  return (
    <Link to="/" className={`${styles.logo} ${variant === "light" ? styles.light : ""}`}>
      <svg viewBox="0 0 32 32" className={styles.mark} aria-hidden="true">
        <circle cx="16" cy="16" r="16" fill="currentColor" />
        <path
          d="M11 9h6.2c2.4 0 4 1.3 4 3.4 0 1.5-.8 2.5-2 3 1.5.4 2.5 1.6 2.5 3.3 0 2.4-1.8 3.8-4.4 3.8H11V9zm5.7 5.6c1.1 0 1.8-.6 1.8-1.6s-.7-1.5-1.8-1.5h-2.4v3.1h2.4zm.3 5.9c1.2 0 2-.6 2-1.7 0-1-.8-1.6-2-1.6h-2.7v3.3h2.7z"
          fill="#fff"
        />
      </svg>
      <span className={styles.word}>
        Meta<strong>Blog</strong>
      </span>
    </Link>
  );
}
