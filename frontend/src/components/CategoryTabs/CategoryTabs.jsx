import styles from "./CategoryTabs.module.scss";

export default function CategoryTabs({ categories, active, onSelect }) {
  return (
    <div className={styles.tabs}>
      <button
        type="button"
        className={active === "" ? styles.active : ""}
        onClick={() => onSelect("")}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={active === category ? styles.active : ""}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
