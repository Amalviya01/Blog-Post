import CategoryTabs from "../CategoryTabs/CategoryTabs.jsx";
import styles from "./SectionHeader.module.scss";

export default function SectionHeader({
  categories,
  activeCategory,
  onSelectCategory,
  onPrev,
  onNext,
  canGoPrev,
  canGoNext,
}) {
  return (
    <div className={styles.section}>
      <div className={styles.left}>
        <span className={styles.eyebrow}>Our Blogs</span>
        <h2>Read Articles</h2>
        <p>Explore quick tips and insights to boost your reading</p>
      </div>

      <div className={styles.right}>
        <CategoryTabs categories={categories} active={activeCategory} onSelect={onSelectCategory} />

        <div className={styles.arrows}>
          <button type="button" aria-label="Previous" disabled={!canGoPrev} onClick={onPrev}>
            ←
          </button>
          <button type="button" aria-label="Next" disabled={!canGoNext} onClick={onNext}>
            →
          </button>
        </div>
      </div>
    </div>
  );
}
