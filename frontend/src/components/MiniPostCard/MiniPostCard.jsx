import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate.js";
import { estimateReadTime } from "../../utils/estimateReadTime.js";
import styles from "./MiniPostCard.module.scss";

export default function MiniPostCard({ post }) {
  return (
    <article className={styles.card}>
      {post.category && <span className={styles.category}>{post.category}</span>}
      <h4 className={styles.title}>
        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
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
