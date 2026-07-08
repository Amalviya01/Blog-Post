import styles from "./Pagination.module.scss";

function getPageList(current, total) {
  const pages = [];
  const windowSize = 1;

  for (let page = 1; page <= total; page += 1) {
    const isEdge = page === 1 || page === total;
    const isNearCurrent = Math.abs(page - current) <= windowSize;
    if (isEdge || isNearCurrent) {
      pages.push(page);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return pages;
}

export default function Pagination({ currentPage, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav className={styles.pagination}>
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onChange(currentPage - 1)}
      >
        ← Previous
      </button>

      {getPageList(currentPage, totalPages).map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className={styles.ellipsis}>
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            className={page === currentPage ? styles.active : ""}
            onClick={() => onChange(page)}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onChange(currentPage + 1)}
      >
        Next →
      </button>
    </nav>
  );
}
