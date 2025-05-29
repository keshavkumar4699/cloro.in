// HomeMidBar.js
"use client";
import { useState } from "react";
import PostsList from "@/components/PostComponents/PostsList"; 

const HomeMidBar = ({ refreshTrigger }) => {
  return (
    <div className="mx-auto px-2 py-4 sm:px-4 sm:py-6">
      <PostsList key={refreshTrigger} />
    </div>
  );
};

export default HomeMidBar;