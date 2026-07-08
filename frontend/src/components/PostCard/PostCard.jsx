import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate.js";
import styles from "./PostCard.module.scss";

export default function PostCard({ post }) {
  return (
    <article className={styles.card}>
      <Link to={`/blog/${post.slug}`} className={styles.thumbLink}>
        {post.coverImage ? (
          <img src={post.coverImage} alt={post.title} className={styles.thumb} />
        ) : (
          <div className={styles.thumbFallback} />
        )}
      </Link>

      <div className={styles.body}>
        {post.category && <span className={styles.category}>{post.category}</span>}

        <h3 className={styles.title}>
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}

        <div className={styles.meta}>
          {post.author.avatar ? (
            <img src={post.author.avatar} alt={post.author.name} className={styles.avatar} />
          ) : (
            <div className={styles.avatarFallback}>{post.author.name.charAt(0)}</div>
          )}
          <span className={styles.authorName}>{post.author.name}</span>
          <span className={styles.dot}>•</span>
          <span className={styles.date}>{formatDate(post.publishedAt)}</span>
        </div>
      </div>
    </article>
  );
}
