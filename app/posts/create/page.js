"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { categories } from "@/data/categories";
import ChainSearchDropdown from "./ChainSearchDropdown";
import ImageUploadButton from "./ImageUploadButton";
import ErrorMessage from "./ErrorMessage";

export default function CreatePostPage() {
  const { status: sessionStatus } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    image: null,
    imageName: "",
  });
  const [selectedChain, setSelectedChain] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // // Auto-size textarea
  // useEffect(() => {
  //   if (textareaRef.current) {
  //     textareaRef.current.style.height = "auto";
  //     textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  //   }
  // }, [formData.content]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should not exceed 5MB.");
        setFormData(prev => ({ ...prev, image: null, imageName: "" }));
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setFormData(prev => ({ ...prev, image: file, imageName: file.name }));
      if (error) setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sessionStatus !== 'authenticated') { setError("You must be logged in to post."); return; }
    if (!formData.title.trim()) { setError("Title is required."); return; }
    if (!formData.content.trim() && !formData.image) { setError("You must provide either text content or an image."); return; }
    if (!formData.category) { setError("Please select a category."); return; }

    setIsSubmitting(true);
    setError("");
    try {
      const formPayload = new FormData();
      formPayload.append("title", formData.title.trim());
      formPayload.append("content", formData.content.trim());
      formPayload.append("category", formData.category);
      if (formData.image) formPayload.append("image", formData.image);
      if (selectedChain) {
        formPayload.append("chainTitle", selectedChain.title.trim());
        if (!selectedChain.isCreateOption) formPayload.append("chainId", selectedChain._id);
      }
      const response = await fetch("/api/posts", { method: "POST", body: formPayload });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to create post." }));
        throw new Error(errorData.message);
      }
      const newPost = await response.json();
      if (newPost.chain?._id) { router.push(`?chainId=${newPost.chain._id}?postId=${newPost._id}`); }
      else { router.push(`/`); }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (sessionStatus === "loading") {
    return <div className="flex justify-center items-center h-screen"><span className="loading loading-dots loading-lg"></span></div>;
  }
  
  if (sessionStatus === "unauthenticated") {
    return (
      <div className="flex flex-col justify-center items-center h-screen p-4 text-center">
        <h1 className="text-xl font-bold mb-4">Access Denied</h1>
        <p className="text-sm mb-6">Please log in to create a post.</p>
        <button onClick={() => router.push("/")} className="btn btn-primary btn-sm">Go to Homepage</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Create a Post</h1>
        <button
          type="submit"
          form="create-post-form"
          className="btn btn-primary btn-sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? <span className="loading loading-spinner loading-sm"></span> : "Post"}
        </button>
      </div>

      <form id="create-post-form" onSubmit={handleSubmit} className="flex flex-col flex-1 gap-4">
        <ChainSearchDropdown
          selectedChain={selectedChain}
          setSelectedChain={setSelectedChain}
          isSubmitting={isSubmitting}
        />

        {/* Title */}
        <div className="form-control">
          <input
            type="text"
            name="title"
            className="input input-bordered w-full text-sm"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
            maxLength={120}
            disabled={isSubmitting}
            placeholder="Title"
          />
        </div>

        {/* Content */}
        <div className="form-control flex-1">
          <textarea
            ref={textareaRef}
            name="content"
            className="textarea textarea-bordered w-full text-sm flex-1 resize-none"
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            disabled={isSubmitting}
            placeholder="Text (optional if image is provided)"
          />
        </div>

        {/* Category and Image Upload */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="category"
            className="select select-bordered w-full text-sm"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            required
            disabled={isSubmitting}
          >
            <option value="" disabled>Choose a category</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          <ImageUploadButton
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
            imageName={formData.imageName}
            isSubmitting={isSubmitting}
          />
        </div>

        <ErrorMessage error={error} />
      </form>
    </div>
  );
}