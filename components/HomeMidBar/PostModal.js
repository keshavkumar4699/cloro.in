"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";

export default function PostModal({ isOpen, onClose, onPostCreated }) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isBrowser, setIsBrowser] = useState(false);
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    setIsBrowser(true);

    if (isOpen) {
      document.body.classList.add("modal-open");
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.setProperty(
        "--scrollbar-width",
        `${scrollbarWidth}px`
      );
    } else {
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("--scrollbar-width");
    }

    return () => {
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("--scrollbar-width");
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session?.user?.id) {
      setError("You must be logged in to post");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const formPayload = new FormData();
      formPayload.append("title", formData.title);
      formPayload.append("content", formData.content);
      formPayload.append("category", formData.category);
      if (formData.image) {
        formPayload.append("image", formData.image);
      }

      const response = await fetch("/api/posts", {
        method: "POST",
        body: formPayload,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create post");
      }

      const newPost = await response.json();
    
      if (typeof onPostCreated === 'function') {
        onPostCreated(newPost);
      }

      setFormData({
        title: '',
        content: '',
        category: '',
        image: null
      });
      onClose();
    } catch (err) {
      console.error('Post creation failed:', err);
      setError(err.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isBrowser) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Modal container */}
      <div
        className={`fixed inset-0 z-40 flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? '' : 'pointer-events-none'}`}
      >
        <div
          ref={modalRef}
          className={`modal-box relative max-w-2xl w-full mx-auto shadow-2xl transition-all duration-300 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle absolute right-2 top-2 transition-transform hover:scale-110"
            aria-label="Close modal"
            disabled={isSubmitting}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          <h3 className="text-2xl font-bold mb-4">Create New Post</h3>

          {error && (
            <div className="alert alert-error mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input input-bordered w-full focus:ring-2 focus:ring-primary transition-colors"
                required
                maxLength={100}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Content</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="textarea textarea-bordered h-48 focus:ring-2 focus:ring-primary transition-colors"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="select select-bordered w-full focus:ring-2 focus:ring-primary transition-colors"
                required
                disabled={isSubmitting}
              >
                <option value="">Select a category</option>
                <option value="technology">Technology</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="education">Education</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Image (Optional)</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="btn btn-outline btn-sm hover:bg-primary/10 transition-colors"
                  disabled={isSubmitting}
                >
                  <PhotoIcon className="w-5 h-5 mr-1" />
                  {formData.image ? "Change Image" : "Select Image"}
                </button>
                {formData.image && (
                  <span className="text-sm">{formData.image.name}</span>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="modal-action">
              <button
                type="button"
                onClick={onClose}
                className="btn hover:bg-base-200 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary hover:bg-primary-focus transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Posting...
                  </>
                ) : (
                  "Create Post"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}