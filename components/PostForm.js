// components/PostForm.js
"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) return setError("You must be logged in to post");
    
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });
      console.log(res);

      if (!res.ok) throw new Error(await res.text());
      
      setTitle("");
      setContent("");
      router.refresh(); // Refresh to show new post
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      <div>
        <label htmlFor="title" className="block mb-2 font-medium">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="content" className="block mb-2 font-medium">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded min-h-[100px]"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isSubmitting ? "Posting..." : "Create Post"}
      </button>
    </form>
  );
}