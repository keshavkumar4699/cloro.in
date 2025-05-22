// HomeMidBar.js
"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import PostModal from "@/components/HomeMidBar/PostModal"; // Using the previously refactored PostModal
import PostsList from "@/components/HomeMidBar/PostsList"; // Using the previously refactored PostsList

const HomeMidBar = () => {
  const { data: isSession } = useSession();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const handlePostCreated = () => {
    // Trigger a refresh by changing the key
    setRefreshTrigger((prev) => prev + 1);
    setIsPostModalOpen(false);
  };
  // Note: PostsList now fetches its own data. If you want HomeMidBar to manage posts,
  // you'd fetch here and pass to PostsList, and PostsList would accept posts as a prop.
  // For this example, we assume PostsList handles its own data fetching.

  // The handleNewPost logic might be better if PostModal itself triggers a global state update
  // or a refetch in PostsList, rather than HomeMidBar managing posts that PostsList also fetches.
  // For simplicity, if PostModal's onSuccess reloads the page or triggers a revalidation,
  // this specific handleNewPost might not be strictly necessary here.
  // However, if you want optimistic updates, this is one way to approach it.
  // const [optimisticPosts, setOptimisticPosts] = useState([]);
  // const handleNewPost = (newPost) => {
  //   // For optimistic updates:
  //   // setOptimisticPosts((prevPosts) => [newPost, ...prevPosts]);
  //   setIsPostModalOpen(false);
  //   // Revalidate/refetch posts in PostsList or use a shared state
  // };

  return (
    // This container provides padding and max-width for the content within the scrollable area.
    // PostsList itself also has max-w-3xl, so this could be adjusted.
    <div className="mx-auto px-2 py-4 sm:px-4 sm:py-6">
      {/* Optional: "Create Post" input-like bar at the top */}
      {isSession ? (
        <div className="mb-6">
          <div
            onClick={() => setIsPostModalOpen(true)}
            className="bg-base-100 px-3 sm:p-1 sm:px-2 rounded-3xl shadow hover:shadow-md flex items-center cursor-pointer transition-all group"
          >
            <div className="avatar mr-3 sm:mr-4 relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                <PencilSquareIcon className="w-4 h-4 sm:w-5 sm:h-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            <input
              type="text"
              placeholder="Create a new post..."
              className="input input-ghost w-full !p-0 text-sm sm:text-base group-hover:text-primary transition-colors"
              readOnly
            />
          </div>
        </div>):null}
    
      {/* PostsList will render its loading/empty/error states internally */}
      <PostsList key={refreshTrigger} />

      <PostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onPostCreated={handlePostCreated}
        // onPostCreated={handleNewPost} // See note above about post creation handling
      />
    </div>
  );
};

export default HomeMidBar;
