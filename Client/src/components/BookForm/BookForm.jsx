import { useState } from "react";
import "./BookForm.css";

const CATEGORIES = [
  "Fiction",
  "Non-Fiction",
  "Science",
  "Software Engineering",
  "History",
  "Biography",
  "Children",
  "Other",
];

function BookForm({
  initialValues,
  onSubmit,
  submitting,
  submitLabel = "Save Book",
}) {
  const [values, setValues] = useState({
    title: initialValues?.title || "",
    author: initialValues?.author || "",
    isbn: initialValues?.isbn || "",
    category: initialValues?.category || "",
    quantity: initialValues?.quantity ?? 1,
    publishedYear: initialValues?.publishedYear || "",
  });
  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState(
    initialValues?.coverImagePreview || null,
  );
  const [errors, setErrors] = useState({});

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverImage(file);
    setPreview(URL.createObjectURL(file));
  }

  function validate() {
    const next = {};
    if (!values.title.trim()) next.title = "Title is required";
    if (!values.author.trim()) next.author = "Author is required";
    if (!values.isbn.trim()) next.isbn = "ISBN is required";
    if (!values.category.trim()) next.category = "Select a category";
    if (values.quantity === "" || Number(values.quantity) < 0)
      next.quantity = "Enter a valid quantity";
    if (
      values.publishedYear &&
      (values.publishedYear < 1000 ||
        values.publishedYear > new Date().getFullYear())
    ) {
      next.publishedYear = "Enter a valid year";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...values, coverImage });
  }

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <div className="book-form-grid">
        <div className="book-form-cover">
          <label htmlFor="coverImage" className="book-form-cover-drop">
            {preview ? (
              <img src={preview} alt="Cover preview" />
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 5v14M5 12h14"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
                <span>Upload cover</span>
              </>
            )}
          </label>
          <input
            id="coverImage"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFile}
            hidden
          />
          <p className="book-form-cover-hint">JPG, PNG or WEBP, up to 5MB</p>
        </div>

        <div className="book-form-fields">
          <div className="field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              value={values.title}
              data-invalid={!!errors.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Clean Code"
            />
            {errors.title && (
              <span className="field-error">{errors.title}</span>
            )}
          </div>

          <div className="field">
            <label htmlFor="author">Author</label>
            <input
              id="author"
              value={values.author}
              data-invalid={!!errors.author}
              onChange={(e) => update("author", e.target.value)}
              placeholder="e.g. Robert C. Martin"
            />
            {errors.author && (
              <span className="field-error">{errors.author}</span>
            )}
          </div>

          <div className="book-form-row">
            <div className="field">
              <label htmlFor="isbn">ISBN</label>
              <input
                id="isbn"
                value={values.isbn}
                data-invalid={!!errors.isbn}
                onChange={(e) => update("isbn", e.target.value)}
                placeholder="978..."
              />
              {errors.isbn && (
                <span className="field-error">{errors.isbn}</span>
              )}
            </div>

            <div className="field">
              <label htmlFor="publishedYear">Published Year</label>
              <input
                id="publishedYear"
                type="number"
                value={values.publishedYear}
                data-invalid={!!errors.publishedYear}
                onChange={(e) => update("publishedYear", e.target.value)}
                placeholder="2008"
              />
              {errors.publishedYear && (
                <span className="field-error">{errors.publishedYear}</span>
              )}
            </div>
          </div>

          <div className="book-form-row">
            <div className="field">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={values.category}
                data-invalid={!!errors.category}
                onChange={(e) => update("category", e.target.value)}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className="field-error">{errors.category}</span>
              )}
            </div>

            <div className="field">
              <label htmlFor="quantity">Total Copies</label>
              <input
                id="quantity"
                type="number"
                min="0"
                value={values.quantity}
                data-invalid={!!errors.quantity}
                onChange={(e) => update("quantity", e.target.value)}
              />
              {errors.quantity && (
                <span className="field-error">{errors.quantity}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="book-form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default BookForm;
