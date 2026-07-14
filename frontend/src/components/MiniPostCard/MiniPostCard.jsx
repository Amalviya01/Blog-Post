import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate.js";
import { estimateReadTime } from "../../utils/estimateReadTime.js";
import styles from "./MiniPostCard.module.scss";

export default function MiniPostCard({ post, onSelect }) {
  return (
    <article className={styles.card}>
      {post.category && <span className={styles.category}>{post.category}</span>}
      <h4 className={styles.title}>
        {onSelect ? (
          <button type="button" className={styles.linkButton} onClick={() => onSelect(post.slug)}>
            {post.title}
          </button>
        ) : (
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        )}
      </h4>
      <div className={styles.divider} />
      <div className={styles.meta}>
        <span>{formatDate(post.publishedAt)}</span>
        <span className={styles.dot}>•</span>
        <span>{estimateReadTime(post.content)}</span>
      </div>
    </article>
  );
}
