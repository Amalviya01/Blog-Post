import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import Header from "../../components/Header/Header.jsx";
import Hero from "../../components/Hero/Hero.jsx";
import SectionHeader from "../../components/SectionHeader/SectionHeader.jsx";
import FeaturedGridCard from "../../components/FeaturedGridCard/FeaturedGridCard.jsx";
import MiniPostCard from "../../components/MiniPostCard/MiniPostCard.jsx";
import PostCard from "../../components/PostCard/PostCard.jsx";
import NewsListItem from "../../components/NewsListItem/NewsListItem.jsx";
import Pagination from "../../components/Pagination/Pagination.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import { GET_POSTS, GET_FILTERS } from "../../graphql/queries.js";
import styles from "./Home.module.scss";

const PAGE_SIZE = 12;

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [featuredOffset, setFeaturedOffset] = useState(0);

  const page = Number(searchParams.get("page") || 1);
  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";

  const { data: filtersData } = useQuery(GET_FILTERS);
  const { data, loading, error } = useQuery(GET_POSTS, {
    variables: { page, limit: PAGE_SIZE, category: category || undefined, search: search || undefined },
  });

  function updateParams(next) {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    setFeaturedOffset(0);
    setSearchParams(params);
  }

  const posts = data?.posts.posts || [];
  const isCurated = page === 1 && !category && !search;

  const heroPost = isCurated ? posts[0] : null;
  const rest = isCurated ? posts.slice(1) : [];

  const featuredPair =
    rest.length > 2
      ? [rest[featuredOffset % rest.length], rest[(featuredOffset + 1) % rest.length]]
      : rest.slice(0, 2);
  const miniPosts = rest.slice(2, 5);
  const newsPosts = rest.slice(5, 7);
  const secondGridPosts = isCurated ? rest.slice(7) : posts;

  return (
    <>
      <Header
        searchValue={search}
        onSearch={(term) => updateParams({ search: term, page: null })}
      />

      {heroPost && <Hero post={heroPost} />}

      <main className={styles.main}>
        <SectionHeader
          categories={filtersData?.categories || []}
          activeCategory={category}
          onSelectCategory={(value) => updateParams({ category: value, page: null })}
          onPrev={() => setFeaturedOffset((prev) => Math.max(0, prev - 2))}
          onNext={() => setFeaturedOffset((prev) => prev + 2)}
          canGoPrev={featuredOffset > 0}
          canGoNext={rest.length > 2}
        />

        {loading && <p className={styles.status}>Loading posts…</p>}
        {error && <p className={styles.status}>Failed to load posts: {error.message}</p>}

        {!loading && !error && posts.length === 0 && (
          <p className={styles.status}>No posts found. Be the first to create one!</p>
        )}

        {featuredPair.length > 0 && (
          <div className={styles.featuredGrid}>
            {featuredPair.map((post, index) => (
              <FeaturedGridCard key={post.id} post={post} variant={index === 1 ? "dark" : "image"} />
            ))}
          </div>
        )}

        {miniPosts.length > 0 && (
          <div className={styles.miniRow}>
            {miniPosts.map((post) => (
              <MiniPostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {isCurated && newsPosts.length > 0 && (
          <div className={styles.newsList}>
            {newsPosts.map((post) => (
              <NewsListItem key={post.id} post={post} />
            ))}
          </div>
        )}

        {secondGridPosts.length > 0 && (
          <div className={styles.grid}>
            {secondGridPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {data?.posts && (
          <Pagination
            currentPage={data.posts.currentPage}
            totalPages={data.posts.totalPages}
            onChange={(next) => updateParams({ page: String(next) })}
          />
        )}
      </main>

      <Footer />
    </>
  );
}
