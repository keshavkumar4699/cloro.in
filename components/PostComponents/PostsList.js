// components/PostsList.jsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PostContent } from "./PostContent";
import { PostHeader } from "./PostHeader";
import { PostAuthor } from "./PostAuthor";
import { PostStats } from "./PostStats";
import { PostSkeleton } from "./PostSkeleton";

function PostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followedPosts, setFollowedPosts] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        setPosts(data);
        
        const initialFollowed = {};
        data.forEach((post) => {
          initialFollowed[post._id] = false;
        });
        setFollowedPosts(initialFollowed);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const toggleFollow = (postId) => {
    setFollowedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const sharePost = (postId, e) => {
    e.stopPropagation();
    const postUrl = `${window.location.origin}/posts/${postId}`;
    navigator.clipboard.writeText(postUrl).then(() => {
      alert("Post link copied to clipboard!");
    });
  };

  const handlePostClick = (postId) => {
    setSelectedPost(postId === selectedPost ? null : postId);
    router.push(`/posts/${postId}`);
  };

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  );

  if (error) return <div className="text-error text-center mt-8">Error: {error}</div>;

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post._id}
          className={`card rounded-xl p-4 transition-all duration-300 border cursor-pointer ${
            selectedPost === post._id
              ? "bg-base-300 border-primary/50 shadow-md"
              : "bg-base-100 border-base-300 hover:bg-base-200 hover:border-primary/20 hover:shadow-lg"
          }`}
          onClick={() => handlePostClick(post._id)}
        >
          <PostHeader
            post={post}
            isFollowing={followedPosts[post._id]}
            onToggleFollow={() => toggleFollow(post._id)}
          />

          <div className={`rounded-xl p-3 my-3 transition-all duration-300 ${
            selectedPost === post._id ? "bg-base-200" : "bg-gradient-to-br from-base-200/50 to-base-300/50"
          }`}>
            <PostContent 
              content={post.content} 
              imageUrl={post.imageUrl} 
              isSelected={selectedPost === post._id} 
            />
          </div>

          <div className="flex items-center justify-between mt-2">
            <PostAuthor author={post.author} />
            <PostStats 
              post={post} 
              onShare={(e) => sharePost(post._id, e)} 
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default PostsList;