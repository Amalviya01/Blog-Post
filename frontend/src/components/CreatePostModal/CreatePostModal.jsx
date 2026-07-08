import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import ReactMarkdown from "react-markdown";
import MarkdownToolbar from "../MarkdownToolbar/MarkdownToolbar.jsx";
import { ADD_POST } from "../../graphql/mutations.js";
import { uploadImage } from "../../utils/uploadImage.js";
import { useCreateModal } from "../../context/CreateModalContext.jsx";
import styles from "./CreatePostModal.module.scss";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function todayISODate() {
  return new Date().toISOString().slice(0, 10);
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 18 18" width="14" height="14" fill="none">
      <path
        d="M1.5 9S4.2 3.5 9 3.5 16.5 9 16.5 9 13.8 14.5 9 14.5 1.5 9 1.5 9Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

const initialState = {
  title: "",
  slug: "",
  slugTouched: false,
  content: "",
  category: "",
  tags: [],
  tagInput: "",
  visibility: "Public",
  authorName: "",
  publishDate: todayISODate(),
  coverFile: null,
  coverPreview: "",
};

export default function CreatePostModal() {
  const { isOpen, close } = useCreateModal();
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const [form, setForm] = useState(initialState);
  const [showPreview, setShowPreview] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [addPost] = useMutation(ADD_POST);

  const isDirty = Boolean(
    form.title.trim() ||
      form.content.trim() ||
      form.authorName.trim() ||
      form.category.trim() ||
      form.tags.length > 0 ||
      form.coverFile
  );

  useEffect(() => {
    if (!isOpen || !isDirty) return;

    function handleBeforeUnload(event) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isOpen, isDirty]);

  function update(patch) {
    setForm((prev) => ({ ...prev, ...patch }));
  }

  function handleTitleChange(value) {
    update({ title: value, slug: form.slugTouched ? form.slug : slugify(value) });
  }

  function handleSlugChange(value) {
    update({ slug: slugify(value), slugTouched: true });
  }

  function handleCoverChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    update({ coverFile: file, coverPreview: URL.createObjectURL(file) });
  }

  function addTag() {
    const value = form.tagInput.trim();
    if (value && !form.tags.includes(value)) {
      update({ tags: [...form.tags, value], tagInput: "" });
    } else {
      update({ tagInput: "" });
    }
  }

  function removeTag(tag) {
    update({ tags: form.tags.filter((existing) => existing !== tag) });
  }

  function handleClose() {
    setForm(initialState);
    setFormError("");
    setShowPreview(false);
    close();
  }

  function requestClose() {
    if (isDirty && !window.confirm("Are you sure you want to discard the changes?")) {
      return;
    }
    handleClose();
  }

  async function handleContinue() {
    setFormError("");

    if (!form.title.trim() || !form.content.trim() || !form.authorName.trim()) {
      setFormError("Blog title, content, and author name are required.");
      return;
    }

    setSubmitting(true);
    try {
      let coverImage = "";
      if (form.coverFile) {
        coverImage = await uploadImage(form.coverFile);
      }

      const { data } = await addPost({
        variables: {
          input: {
            title: form.title,
            slug: form.slug,
            content: form.content,
            coverImage,
            category: form.category,
            tags: form.tags,
            author: { name: form.authorName },
            status: "published",
            publishedAt: new Date(form.publishDate).toISOString(),
          },
        },
      });

      handleClose();
      navigate(`/blog/${data.addPost.slug}`);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={requestClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.head}>
          <h2>Create New Blog</h2>
          <div className={styles.headActions}>
            <button type="button" className={styles.previewButton} onClick={() => setShowPreview(true)}>
              <EyeIcon /> Preview
            </button>
            <button type="button" className={styles.closeButton} aria-label="Close" onClick={requestClose}>
              ✕
            </button>
          </div>
        </div>

        {formError && <div className={styles.error}>{formError}</div>}

        <div className={styles.field}>
          <label>Blog Title*</label>
          <input
            type="text"
            placeholder="Enter your blog post title.."
            value={form.title}
            onChange={(event) => handleTitleChange(event.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label>URL Slug*</label>
          <input
            type="text"
            placeholder="your-blog-post-url"
            value={form.slug}
            onChange={(event) => handleSlugChange(event.target.value)}
          />
          <div className={styles.slugPreview}>Full URL: /blog/{form.slug || "your-slug"}</div>
        </div>

        <div className={styles.field}>
          <label>Content*</label>
          <MarkdownToolbar
            textareaRef={contentRef}
            value={form.content}
            onChange={(content) => update({ content })}
          />
          <textarea
            ref={contentRef}
            className={styles.contentArea}
            rows={8}
            placeholder="Write your blog content here…"
            value={form.content}
            onChange={(event) => update({ content: event.target.value })}
          />
        </div>

        <label className={styles.dropzone}>
          {form.coverPreview ? (
            <img src={form.coverPreview} alt="Cover preview" className={styles.dropzonePreview} />
          ) : (
            <>
              <span className={styles.dropzoneIcon}>⇧</span>
              <strong>Upload Image</strong>
              <span>PNG, JPEG</span>
              <span>Maximum File Size: 5MB</span>
            </>
          )}
          <input type="file" accept="image/png,image/jpeg" onChange={handleCoverChange} hidden />
        </label>

        <h3 className={styles.sectionTitle}>Author Information</h3>
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Author Name*</label>
            <input
              type="text"
              placeholder="Enter your blog post title.."
              value={form.authorName}
              onChange={(event) => update({ authorName: event.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label>Publish Date*</label>
            <input
              type="date"
              value={form.publishDate}
              onChange={(event) => update({ publishDate: event.target.value })}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label>Category</label>
          <input
            type="text"
            placeholder="e.g. Design, Development, Business"
            value={form.category}
            onChange={(event) => update({ category: event.target.value })}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label>Tags</label>
            <input
              type="text"
              placeholder="Add a Tag.."
              value={form.tagInput}
              onChange={(event) => update({ tagInput: event.target.value })}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addTag();
                }
              }}
            />
            <div className={styles.tags}>
              {form.tags.map((tag) => (
                <span key={tag}>
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className={styles.field}>
            <label>Visibility</label>
            <select
              value={form.visibility}
              onChange={(event) => update({ visibility: event.target.value })}
            >
              <option>Public</option>
              <option>Private</option>
              <option>People</option>
            </select>
          </div>
        </div>

        <button type="button" className={styles.continueButton} disabled={submitting} onClick={handleContinue}>
          {submitting ? "Publishing…" : "CONTINUE"}
        </button>
      </div>

      {showPreview && (
        <div className={styles.previewOverlay} onClick={() => setShowPreview(false)}>
          <div className={styles.previewModal} onClick={(event) => event.stopPropagation()}>
            <button type="button" className={styles.previewClose} onClick={() => setShowPreview(false)}>
              ✕
            </button>
            {form.coverPreview && (
              <img src={form.coverPreview} alt="Cover" className={styles.previewCover} />
            )}
            <h1>{form.title || "Untitled post"}</h1>
            <div className={styles.previewContent}>
              <ReactMarkdown>{form.content || "_Nothing written yet._"}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
