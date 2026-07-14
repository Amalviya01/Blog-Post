import ReactMarkdown from "react-markdown";
import styles from "./PostDetailModal.module.scss";

export default function PostDetailModal({ post, loading, error, onClose }) {
  if (!post && !loading && !error) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <button type="button" className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        {loading ? (
          <div className={styles.status}>Opening post…</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          post && (
            <article className={styles.content}>
              <header className={styles.header}>
                {post.category && <span className={styles.category}>{post.category}</span>}
                <h2 className={styles.title}>{post.title}</h2>
                <div className={styles.meta}> 
                  <span>{post.author.name}</span>
                  <span className={styles.dot}>•</span>
                  <span>{post.viewCount} views</span>
                </div>
              </header>

              {post.coverImage && (
                <img src={post.coverImage} alt={post.title} className={styles.cover} />
              )}

              <div className={styles.body}>
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>

              {post.tags.length > 0 && (
                <div className={styles.tags}>
                  {post.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          )
        )}
      </div>
    </div>
  );
}
