// components/HomeMidBar.js
"use client";

import { Suspense } from "react"; // Import Suspense
import { useSearchParams } from "next/navigation";
// Removed: import { useSession } from "next-auth/react"; // Not directly used for view logic here
import PostsList from "@/components/PostComponents/PostsList";
import ChainView from "@/components/ChainComponents/ChainView"; // Adjust path if needed

// Content component to handle searchParams logic
const HomeMidBarContent = () => {
  const searchParams = useSearchParams();
  const chainIdFromUrl = searchParams.get('chainId');
  const postIdFromUrl = searchParams.get('postId'); // To highlight specific post in chain

  if (chainIdFromUrl) {
    // If chainId is in URL, display the ChainView
    return <ChainView chainId={chainIdFromUrl} currentPostIdInChain={postIdFromUrl} />;
  } else {
    // Otherwise, display the PostsList
    return <PostsList />;
  }
};

const HomeMidBar = () => {
  // const { data: isSession } = useSession(); // Can be kept if other logic in HomeMidBar depends on session

  return (
    <div className="mx-auto">
      {/*
        Wrap the component that uses useSearchParams in Suspense.
        This is a requirement in Next.js App Router when reading searchParams
        during rendering, as it can cause the component to suspend.
      */}
      <Suspense fallback={<LoadingState />}>
        <HomeMidBarContent />
      </Suspense>
    </div>
  );
};

// Basic loading state for Suspense fallback
const LoadingState = () => (
  <div className="flex justify-center items-center py-10">
    <span className="loading loading-lg loading-dots text-primary"></span>
  </div>
);

export default HomeMidBar;