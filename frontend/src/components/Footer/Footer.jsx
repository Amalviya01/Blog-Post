import Logo from "../Logo/Logo.jsx";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Logo />
        </div>

        <div className={styles.about}>
          <h4>About</h4>
          <p>
            MetaBlog is a place for writers and readers to share ideas on design, development, and
            technology — practical articles, honest opinions, and the occasional deep dive.
          </p>
        </div>

        <div className={styles.contact}>
          <p>
            <strong>Email:</strong> hello@metablog.com
          </p>
          <p>
            <strong>Phone:</strong> +1 (555) 012-3456
          </p>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} MetaBlog. All rights reserved.</span>
        <div className={styles.links}>
          <span>Terms of Use</span>
          <span>Privacy Policy</span>
          <span>Cookie Policy</span>
        </div>
      </div>
    </footer>
  );
}
