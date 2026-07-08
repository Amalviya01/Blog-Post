import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate.js";
import styles from "./Hero.module.scss";

export default function Hero({ post }) {
  if (!post) return null;

  return (
    <div className={styles.wrap}>
      <section
        className={styles.hero}
        style={post.coverImage ? { backgroundImage: `url(${post.coverImage})` } : undefined}
      >
        <div className={styles.overlay} />
        <div className={styles.content}>
          {post.category && <span className={styles.badge}>{post.category}</span>}
          <h1 className={styles.title}>
            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
          </h1>
          {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
          <div className={styles.meta}>
            {post.author.avatar ? (
              <img src={post.author.avatar} alt={post.author.name} className={styles.avatar} />
            ) : (
              <div className={styles.avatarFallback}>{post.author.name.charAt(0)}</div>
            )}
            <span>by {post.author.name}</span>
            <span className={styles.dot}>•</span>
            <span>{formatDate(post.publishedAt)}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
