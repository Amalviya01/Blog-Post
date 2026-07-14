import { Link } from "react-router-dom";
import { estimateReadTime } from "../../utils/estimateReadTime.js";
import styles from "./FeaturedGridCard.module.scss";

export default function FeaturedGridCard({ post, variant = "image", onSelect }) {
  return (
    <article className={`${styles.card} ${variant === "dark" ? styles.dark : ""}`}>
      {onSelect ? (
        <button type="button" className={styles.media} onClick={() => onSelect(post.slug)}>
          {post.coverImage ? (
            <img src={post.coverImage} alt={post.title} />
          ) : (
            <div className={styles.mediaFallback} />
          )}
        </button>
      ) : (
        <Link to={`/blog/${post.slug}`} className={styles.media}>
          {post.coverImage ? (
            <img src={post.coverImage} alt={post.title} />
          ) : (
            <div className={styles.mediaFallback} />
          )}
        </Link>
      )}

      <div className={styles.body}>
        <div className={styles.meta}>
          {post.author.avatar ? (
            <img src={post.author.avatar} alt={post.author.name} className={styles.avatar} />
          ) : (
            <div className={styles.avatarFallback}>{post.author.name.charAt(0)}</div>
          )}
          <div className={styles.metaText}>
            <span className={styles.authorName}>{post.author.name}</span>
            {post.category && <span className={styles.role}>{post.category}</span>}
          </div>
          <span className={styles.readTime}>{estimateReadTime(post.content)}</span>
        </div>

        <h3 className={styles.title}>
          {onSelect ? (
            <button type="button" className={styles.titleButton} onClick={() => onSelect(post.slug)}>
              {post.title}
            </button>
          ) : (
            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
          )}
        </h3>
        {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
      </div>
    </article>
  );
}
