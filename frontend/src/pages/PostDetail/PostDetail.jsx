import { useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import ReactMarkdown from "react-markdown";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import PostCard from "../../components/PostCard/PostCard.jsx";
import { GET_POST, GET_POSTS } from "../../graphql/queries.js";
import { formatDate } from "../../utils/formatDate.js";
import styles from "./PostDetail.module.scss";

export default function PostDetail() {
  const { slug } = useParams();
  const { data, loading, error } = useQuery(GET_POST, { variables: { slug } });

  const { data: relatedData } = useQuery(GET_POSTS, {
    variables: { limit: 4, category: data?.post?.category || undefined },
    skip: !data?.post,
  });
  const relatedPosts = (relatedData?.posts.posts || []).filter((p) => p.slug !== slug).slice(0, 3);

  if (loading) {
    return (
      <>
        <Header />
        <p className={styles.status}>Loading post…</p>
      </>
    );
  }

  if (error || !data?.post) {
    return (
      <>
        <Header />
        <div className={styles.status}>
          <p>Post not found.</p>
          <Link to="/">← Back to all posts</Link>
        </div>
      </>
    );
  }

  const post = data.post;

  return (
    <>
      <Header />

      <main className={styles.main}>
        <article>
          {post.category && <span className={styles.category}>{post.category}</span>}
          <h1 className={styles.title}>{post.title}</h1>

          <div className={styles.meta}>
            {post.author.avatar ? (
              <img src={post.author.avatar} alt={post.author.name} className={styles.avatar} />
            ) : (
              <div className={styles.avatarFallback}>{post.author.name.charAt(0)}</div>
            )}
            <span className={styles.authorName}>{post.author.name}</span>
            <span className={styles.dot}>•</span>
            <span>{formatDate(post.publishedAt)}</span>
          </div>

          {post.coverImage && (
            <img src={post.coverImage} alt={post.title} className={styles.cover} />
          )}

          <div className={styles.content}>
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {post.tags.length > 0 && (
            <div className={styles.tags}>
              {post.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          )}
        </article>
      </main>

      {relatedPosts.length > 0 && (
        <section className={styles.related}>
          <h2>More like this</h2>
          <div className={styles.relatedGrid}>
            {relatedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
