// HomeMidBar.js
"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import PostModal from "@/components/PostComponents/PostModal"; 
import PostsList from "@/components/PostComponents/PostsList"; 

const HomeMidBar = () => {
  const { data: isSession } = useSession();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const handlePostCreated = () => {
    // Trigger a refresh by changing the key
    setRefreshTrigger((prev) => prev + 1);
    setIsPostModalOpen(false);
  };

  return (
    <div className="mx-auto px-2 py-4 sm:px-4 sm:py-6">
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
      />
    </div>
  );
};

export default HomeMidBar;
