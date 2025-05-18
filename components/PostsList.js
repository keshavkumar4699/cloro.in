// components/PostsList.js
"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChatBubbleLeftEllipsisIcon, 
  TagIcon, 
  UserCircleIcon, 
  CalendarDaysIcon, 
  PhotoIcon, 
  ExclamationCircleIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const PostImage = ({ src, alt }) => {
  if (!src) return null;
  return (
    <div className="mt-3 mb-2 rounded-lg overflow-hidden max-h-96 flex justify-center bg-base-200">
      <img src={src} alt={alt} className="object-contain max-h-96" />
    </div>
  );
};

export default function PostsList({ initialPosts = [] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Update posts when initialPosts changes (like after a new post)
  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      scale: 0.98,
      transition: { duration: 0.2 }
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) {
          throw new Error(`Failed to fetch posts. Status: ${res.status}`);
        }
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4 py-12">
        <span className="loading loading-ball loading-lg text-primary"></span>
        <p className="text-base-content/70">Loading awesome content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg my-8">
        <ExclamationCircleIcon className="stroke-current shrink-0 h-6 w-6" />
        <div>
          <h3 className="font-bold">Oops! Something went wrong.</h3>
          <div className="text-xs">{error}</div>
        </div>
        <button 
          className="btn btn-sm btn-ghost" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <PhotoIcon className="w-20 h-20 mx-auto text-base-content/30 mb-4" />
        <h3 className="text-2xl font-semibold text-base-content mb-2">No Posts Yet!</h3>
        <p className="text-base-content/70"> It&excl;s a bit quiet here. Be the first to share something amazing!</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="space-y-6 py-8 max-w-3xl mx-auto px-4"
      variants={listVariants}
      initial="hidden"
      animate="show"
    >
      <AnimatePresence>
        {posts.map((post) => (
          <motion.div
            key={post._id}
            variants={itemVariants}
            layout
            className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out rounded-lg border border-base-300/50"
          >
            <div className="card-body p-5 md:p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="avatar">
                  <div className="w-10 h-10 rounded-full ring-1 ring-primary/50 ring-offset-base-100 ring-offset-1">
                    {post.author?.image ? (
                      <img 
                        src={post.author.image} 
                        alt={post.author.name || 'Author'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="bg-neutral text-neutral-content rounded-full w-10 h-10 flex items-center justify-center text-lg font-semibold">
                        {post.author?.name?.charAt(0).toUpperCase() || <UserCircleIcon className="w-6 h-6"/>}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-base-content">
                    {post.author?.name || "Anonymous User"}
                  </p>
                  <p className="text-xs text-base-content/70 flex items-center">
                    <CalendarDaysIcon className="w-3 h-3 mr-1"/>
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric", 
                      month: "short", 
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <h2 className="card-title text-xl md:text-2xl font-bold text-base-content mb-1">
                {post.title}
              </h2>

              {post.category && (
                <div className="badge badge-primary badge-outline text-xs font-medium py-2 px-2.5 mb-3 flex items-center gap-1">
                  <TagIcon className="w-3.5 h-3.5"/>
                  {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                </div>
              )}
              
              {post.imageUrl && <PostImage src={post.imageUrl} alt={post.title} />}

              <p className="text-base-content/90 leading-relaxed mb-4">
                {post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}
              </p>

              <div className="card-actions justify-start items-center mt-4 pt-4 border-t border-base-300/70">
                <button className="btn btn-ghost btn-sm text-base-content/80 hover:bg-base-200 hover:text-primary">
                  <HeartIcon className="h-5 w-5 mr-1" />
                  {post.upvotes || 0}
                </button>
                <button className="btn btn-ghost btn-sm text-base-content/80 hover:bg-base-200 hover:text-primary">
                  <ChatBubbleLeftEllipsisIcon className="h-5 w-5 mr-1" />
                  {post.commentsCount || 0}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}