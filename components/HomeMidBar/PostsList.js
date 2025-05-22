"use client";
import { useEffect, useState } from "react";
import {
  ArrowUpIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PostContent = ({ content, imageUrl }) => {
  return (
    <div className="mt-2 mb-3">
      {content && (
        <p className="text-base-content/90 text-sm mb-3">{content}</p>
      )}
      {imageUrl && (
        <div className="rounded-lg overflow-hidden max-h-96 flex justify-center bg-base-200">
          <img
            src={imageUrl}
            alt="Post content"
            className="object-contain max-h-96 w-full"
          />
        </div>
      )}
    </div>
  );
};

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interactions, setInteractions] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        setPosts(data);
        // Initialize interactions state
        const initialInteractions = {};
        data.forEach((post) => {
          initialInteractions[post._id] = {
            upvoted: false,
            pinned: false,
            linked: false,
          };
        });
        setInteractions(initialInteractions);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const handleInteraction = (postId, type) => {
    setInteractions((prev) => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        [type]: !prev[postId][type],
      },
    }));
  };

  const getButtonStyles = (postId, type) => {
    const base =
      "btn btn-ghost btn-sm p-1 min-h-0 h-auto rounded-lg transition-all duration-200";
    if (interactions[postId]?.[type]) {
      // Active state styles
      return `${base} ${
        type === "upvoted"
          ? "bg-red-50 hover:bg-red-100"
          : type === "pinned"
          ? "bg-green-50 hover:bg-green-100"
          : type === "linked"
          ? "bg-blue-50 hover:bg-blue-100"
          : "bg-violet-50 hover:bg-violet-100"
      }`;
    }

    // Inactive state hover styles
    return `${base} ${
      type === "upvoted"
        ? "hover:bg-red-50"
        : type === "pinned"
        ? "hover:bg-green-50"
        : type === "linked"
        ? "hover:bg-blue-50"
        : "hover:bg-violet-50"
    }`;
  };

  if (loading)
    return (
      <div className="loading loading-spinner text-primary mx-auto mt-8"></div>
    );
  if (error)
    return <div className="text-error text-center mt-8">Error: {error}</div>;

  return (
    <div className="space-y-3 sm:space-y-4">
      {posts.map((post) => (
        <div
          key={post._id}
          className="card bg-base-100 rounded-lg p-3 sm:p-4 transition-all duration-200 hover:bg-base-300 border border-base-200 hover:border-slate-300"
          onClick={(e) => {
            if (!e.target.closest(".interactive")) {
              router.push(`/posts/${post._id}`);
            }
          }}
        >
          {/* Post title and timestamp */}
          <div className="flex items-center flex-wrap gap-x-2">
            <Link
              className="font-semibold text-base-content hover:text-primary transition-colors duration-200 interactive text-sm sm:text-base"
              href={`/posts/${post._id}`}
            >
              {post.title}
            </Link>
            <span className="text-base-content/50 text-xs sm:text-sm">•</span>
            <span className="text-xs sm:text-sm text-base-content/50">
              {formatTimeAgo(post.createdAt)}
            </span>
          </div>

          {/* Post content box */}
          <div className="bg-base-200/50 rounded-lg p-2 sm:p-3 my-2">
            <PostContent content={post.content} imageUrl={post.imageUrl} />
          </div>

          {/* User info and action buttons */}
          <div className="flex items-center justify-between mt-1 sm:mt-2 ">
            <Link
              className="flex items-center space-x-2 interactive hover:bg-base-200 rounded-lg p-1 transition-colors duration-200 max-w-[60%]"
              href={`/users/${post.author?.username || "anonymous"}`}
            >
              <div className="avatar">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full">
                  {post.author?.image ? (
                    <img
                      src={post.author.image}
                      alt={post.author.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="bg-neutral text-neutral-content w-full h-full rounded-full flex items-center justify-center text-xs">
                      {post.author?.name?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
              </div>
              <div className="truncate">
                <p className="text-xs sm:text-sm font-medium truncate">
                  {post.author?.name || "Anonymous"}
                </p>
                <p className="text-[10px] sm:text-xs text-base-content/50 truncate">
                  @{post.author?.username || "user"}
                </p>
              </div>
            </Link>

            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Upvote */}
              <div className="interactive">
                <button
                  className={getButtonStyles(post._id, "upvoted")}
                  onClick={() => handleInteraction(post._id, "upvoted")}
                  onMouseEnter={(e) =>
                    e.currentTarget.classList.add("hover:text-red-500")
                  }
                  onMouseLeave={(e) =>
                    e.currentTarget.classList.remove("hover:text-red-500")
                  }
                >
                  <div className="flex items-center">
                    <ArrowUpIcon
                      className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-200 ${
                        interactions[post._id]?.upvoted
                          ? "text-red-500"
                          : "hover:text-red-500 text-gray-500"
                      }`}
                    />
                    <span className="ml-1 text-xs">{post.upvotes || 0}</span>
                  </div>
                </button>
              </div>
              {/* Links */}
              <div className="interactive">
                <button
                  className={getButtonStyles(post._id, "linked")}
                  onClick={() => handleInteraction(post._id, "linked")}
                  onMouseEnter={(e) =>
                    e.currentTarget.classList.add("hover:text-blue-500")
                  }
                  onMouseLeave={(e) =>
                    e.currentTarget.classList.remove("hover:text-blue-500")
                  }
                >
                  <div className="flex items-center">
                    <LinkIcon
                      className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-200 ${
                        interactions[post._id]?.linked
                          ? "text-blue-500"
                          : "hover:text-blue-500 text-gray-500"
                      }`}
                    />
                    <span className="ml-1 text-xs">{post.links || 0}</span>
                  </div>
                </button>
              </div>
              {/* Pin */}
              <div className="interactive">
                <button
                  className={getButtonStyles(post._id, "pinned")}
                  onClick={() => handleInteraction(post._id, "pinned")}
                  onMouseEnter={(e) =>
                    e.currentTarget.classList.add("hover:text-green-500")
                  }
                  onMouseLeave={(e) =>
                    e.currentTarget.classList.remove("hover:text-green-500")
                  }
                >
                  <div className="flex items-center">
                    <PaperClipIcon
                      className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-200 ${
                        interactions[post._id]?.pinned
                          ? "text-green-500"
                          : "hover:text-green-500 text-gray-500"
                      }`}
                    />
                    <span className="ml-1 text-xs">{post.pins || 0}</span>
                  </div>
                </button>
              </div>
              {/* Share */}
              <div className="interactive">
                <button
                  className={getButtonStyles(post._id, "shared")}
                  onMouseEnter={(e) =>
                    e.currentTarget.classList.add("hover:text-violet-500")
                  }
                  onMouseLeave={(e) =>
                    e.currentTarget.classList.remove("hover:text-violet-500")
                  }
                >
                  <PaperAirplaneIcon
                    className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-200 ${"hover:text-violet-500 text-gray-500"}`}
                  />
                </button>
              </div>{" "}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
