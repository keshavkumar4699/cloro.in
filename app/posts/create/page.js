"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PhotoIcon, ExclamationCircleIcon, PlusIcon } from "@heroicons/react/24/outline";
import { debounce } from "lodash";

export default function CreatePostPage() {
  const { data: session, status: sessionStatus } = useSession();
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
  
  const [chainSearchInput, setChainSearchInput] = useState("");
  const [chainSearchResults, setChainSearchResults] = useState([]);
  const [isChainSearching, setIsChainSearching] = useState(false);
  const [showChainDropdown, setShowChainDropdown] = useState(false);

  const fileInputRef = useRef(null);
  const chainSearchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chainSearchRef.current && !chainSearchRef.current.contains(event.target)) {
        setShowChainDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-size textarea
  const textareaRef = useRef(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [formData.content]);

  // Debounced chain search
  const debouncedChainSearch = useCallback(
    debounce(async (searchTerm) => {
      if (searchTerm.trim().length < 1) {
        setChainSearchResults([]);
        setIsChainSearching(false);
        return;
      }
      setIsChainSearching(true);
      try {
        const response = await fetch(`/api/posts/chains?search=${encodeURIComponent(searchTerm)}&limit=5`);
        if (!response.ok) throw new Error("Failed to fetch chains");
        let results = await response.json();
        const exactMatchExists = results.some(c => c.title.toLowerCase() === searchTerm.trim().toLowerCase());
        if (!exactMatchExists) {
            results.unshift({ _id: "create_new_chain_option", title: searchTerm.trim(), isCreateOption: true });
        }
        setChainSearchResults(results);
      } catch (err) {
        console.error("Chain search failed:", err);
      } finally {
        setIsChainSearching(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedChainSearch(chainSearchInput);
  }, [chainSearchInput, debouncedChainSearch]);

  const handleChainSelect = (chain) => {
    setSelectedChain(chain);
    setChainSearchInput(chain.title);
    setShowChainDropdown(false);
  };

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
        {/* Chain Search - Custom Dropdown */}
        <div className="form-control" ref={chainSearchRef}>
          <div className="relative">
            <input
              type="text"
              className="input input-bordered w-full pl-4 pr-10 text-sm"
              value={chainSearchInput}
              onChange={(e) => {
                setChainSearchInput(e.target.value);
                setShowChainDropdown(true);
              }}
              onFocus={() => setShowChainDropdown(true)}
              placeholder="Search or create a chain (optional)"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowChainDropdown(!showChainDropdown)}
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          {showChainDropdown && (
            <div ref={dropdownRef} className="absolute z-10 mt-10 bg-base-100 border border-base-200 rounded-lg shadow-lg max-h-60 overflow-auto">
              {isChainSearching ? (
                <div className="p-2 text-sm text-center">Searching...</div>
              ) : chainSearchResults.length === 0 ? (
                <div className="p-2 text-sm text-center">No results found</div>
              ) : (
                chainSearchResults.map((chain) => (
                  <div
                    key={chain._id}
                    className={`p-2 text-sm cursor-pointer hover:bg-base-200 ${selectedChain?._id === chain._id ? 'bg-base-200' : ''}`}
                    onClick={() => handleChainSelect(chain)}
                  >
                    {chain.isCreateOption ? (
                      <div className="flex items-center gap-2">
                        <PlusIcon className="w-4 h-4" />
                        <span>Create &quot;{chain.title}&quot;</span>
                      </div>
                    ) : (
                      chain.title
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

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
            <option value="technology">Technology</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="education">Education</option>
            <option value="discussion">Discussion</option>
          </select>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`btn btn-outline justify-start text-left text-sm ${formData.imageName ? 'border-primary' : ''}`}
            disabled={isSubmitting}
          >
            <PhotoIcon className="w-5 h-5 mr-2" />
            {formData.imageName || "Upload Image"}
          </button>
          <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="hidden" />
        </div>

        {error && (
          <div className="alert alert-error text-sm p-3">
            <ExclamationCircleIcon className="w-5 h-5"/>
            <span>{error}</span>
          </div>
        )}
      </form>
    </div>
  );
}