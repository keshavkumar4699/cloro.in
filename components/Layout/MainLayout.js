// MainLayout.js
"use client";
import { useState } from "react";
import Header from "../Header/Header"; // Assuming Header has a fixed height, e.g., h-16 or h-[73px]
// import Footer from "../Footer"; // Uncomment if you re-add the footer
import LeftSidebar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";
import HomeMidBar from "../HomeMidBar/HomeMidBar";

export default function MainLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-base-200"> {/* Use h-screen for full viewport height */}
      <Header toggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)} />
      
      <div className="flex flex-1 overflow-hidden"> {/* This is the main row for the three content columns */}
        
        {/* Left Sidebar */}
        {/* LeftSidebar component handles its own mobile (fixed) vs. desktop (static) behavior. */}
        {/* On desktop (lg:static), it will occupy its defined width (w-64) and shrink-0 prevents it from being squashed. */}
        <LeftSidebar 
          isMobileOpen={isMobileOpen} 
          onMobileClose={() => setIsMobileOpen(false)} 
        />

        {/* Center Content Area (HomeMidBar) */}
        {/* This 'main' tag will take the remaining space and handle scrolling for HomeMidBar's content. */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          {/* Padding for the content inside HomeMidBar can be applied here or within HomeMidBar itself */}
          {/* For example, <div className="p-4 md:p-6"><HomeMidBar /></div> if HomeMidBar shouldn't have root padding */}
          <HomeMidBar /> 
        </main>

        {/* Right Sidebar Area */}
        {/* This wrapper ensures RightSideBar only appears on xl screens, takes appropriate width, and doesn't shrink. */}
        {/* It has its own background and border for visual separation. */}
        <div className="hidden xl:flex flex-col w-1/5 max-w-xs 2xl:max-w-[320px] flex-shrink-0 bg-base-100 border-l border-base-300">
          <RightSideBar />
        </div>
      </div>
      
      {/* <Footer /> */} {/* If you have a footer, consider its placement carefully with h-screen */}
    </div>
  );
}