import styles from "./MarkdownToolbar.module.scss";

function wrapSelection(textarea, before, after, placeholder) {
  const { selectionStart, selectionEnd, value } = textarea;
  const selected = value.slice(selectionStart, selectionEnd) || placeholder;
  const nextValue =
    value.slice(0, selectionStart) + before + selected + after + value.slice(selectionEnd);

  const cursorStart = selectionStart + before.length;
  const cursorEnd = cursorStart + selected.length;

  return { nextValue, cursorStart, cursorEnd };
}

function prefixLine(textarea, prefix) {
  const { selectionStart, value } = textarea;
  const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
  const nextValue = value.slice(0, lineStart) + prefix + value.slice(lineStart);

  return { nextValue, cursorStart: selectionStart + prefix.length, cursorEnd: selectionStart + prefix.length };
}

const ListIcon = () => (
  <svg viewBox="0 0 18 18" width="16" height="16" fill="none">
    <circle cx="2.5" cy="4.5" r="1.3" fill="currentColor" />
    <line x1="6.5" y1="4.5" x2="16" y2="4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="2.5" cy="9" r="1.3" fill="currentColor" />
    <line x1="6.5" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="2.5" cy="13.5" r="1.3" fill="currentColor" />
    <line x1="6.5" y1="13.5" x2="16" y2="13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const LinkIcon = () => (
  <svg viewBox="0 0 18 18" width="16" height="16" fill="none">
    <path
      d="M7.2 11.3a3.4 3.4 0 0 1 0-4.8l1.8-1.8a3.4 3.4 0 0 1 4.8 4.8l-.9.9"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M10.8 6.7a3.4 3.4 0 0 1 0 4.8l-1.8 1.8a3.4 3.4 0 0 1-4.8-4.8l.9-.9"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const ImageIcon = () => (
  <svg viewBox="0 0 18 18" width="16" height="16" fill="none">
    <rect x="1.5" y="2.5" width="15" height="13" rx="1.8" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="6" cy="7" r="1.4" fill="currentColor" />
    <path
      d="M2.5 14l4.2-4.6 3.1 3.5 2.3-2.6 4.4 4.2"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ClearFormatIcon = () => (
  <svg viewBox="0 0 18 18" width="16" height="16" fill="none">
    <path d="M4 3h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M8.5 3v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M2.5 15.5l13-13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const TOOLS = [
  { icon: <strong>B</strong>, title: "Bold", apply: (ta) => wrapSelection(ta, "**", "**", "bold text") },
  { icon: <em>I</em>, title: "Italic", apply: (ta) => wrapSelection(ta, "*", "*", "italic text") },
  { divider: true },
  { icon: <ListIcon />, title: "List", apply: (ta) => prefixLine(ta, "- ") },
  {
    icon: <LinkIcon />,
    title: "Link",
    apply: (ta) => wrapSelection(ta, "[", "](https://)", "link text"),
  },
  {
    icon: <ImageIcon />,
    title: "Image",
    apply: (ta) => wrapSelection(ta, "![", "](https://)", "alt text"),
  },
];

export default function MarkdownToolbar({ textareaRef, value, onChange }) {
  function handleClick(tool) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { nextValue, cursorStart, cursorEnd } = tool.apply(textarea);
    onChange(nextValue);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(cursorStart, cursorEnd);
    });
  }

  function handleClear() {
    onChange(value.replace(/[*_>#`~[\]()!-]/g, ""));
  }

  return (
    <div className={styles.toolbar}>
      {TOOLS.map((tool, index) =>
        tool.divider ? (
          <span key={`divider-${index}`} className={styles.divider} />
        ) : (
          <button key={tool.title} type="button" title={tool.title} onClick={() => handleClick(tool)}>
            {tool.icon}
          </button>
        )
      )}
      <span className={styles.spacer} />
      <button type="button" title="Clear formatting" onClick={handleClear}>
        <ClearFormatIcon />
      </button>
    </div>
  );
}
