import { Link } from "react-router-dom";
import { formatRelativeTime } from "../../utils/formatRelativeTime.js";
import styles from "./NewsListItem.module.scss";

export default function NewsListItem({ post, onSelect }) {
  return (
    <article className={styles.item}>
      {onSelect ? (
        <button type="button" className={styles.thumb} onClick={() => onSelect(post.slug)}>
          {post.coverImage ? (
            <img src={post.coverImage} alt={post.title} />
          ) : (
            <div className={styles.thumbFallback} />
          )}
        </button>
      ) : (
        <Link to={`/blog/${post.slug}`} className={styles.thumb}>
          {post.coverImage ? (
            <img src={post.coverImage} alt={post.title} />
          ) : (
            <div className={styles.thumbFallback} />
          )}
        </Link>
      )}

      <div className={styles.body}>
        <h4>
          {onSelect ? (
            <button type="button" className={styles.titleButton} onClick={() => onSelect(post.slug)}>
              {post.title}
            </button>
          ) : (
            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
          )}
        </h4>
        {post.excerpt && <p>{post.excerpt}</p>}
        <div className={styles.meta}>
          {post.category && <span className={styles.category}>{post.category}</span>}
          <span className={styles.time}>{formatRelativeTime(post.publishedAt)}</span>
        </div>
      </div>
    </article>
  );
}
