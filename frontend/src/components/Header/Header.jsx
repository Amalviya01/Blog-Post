import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../Logo/Logo.jsx";
import { useCreateModal } from "../../context/CreateModalContext.jsx";
import styles from "./Header.module.scss";

export default function Header({ onSearch, searchValue = "" }) {
  const [term, setTerm] = useState(searchValue);
  const navigate = useNavigate();
  const { open } = useCreateModal();

  function handleSubmit(event) {
    event.preventDefault();
    if (onSearch) {
      onSearch(term);
    } else {
      navigate(`/?search=${encodeURIComponent(term)}`);
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Logo />

        <form className={styles.search} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
          />
          <button type="submit" aria-label="Search">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </form>

        <button type="button" className={styles.createButton} onClick={open}>
          + Create Blog
        </button>
      </div>
    </header>
  );
}
