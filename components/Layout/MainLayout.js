// components/Layout/MainLayout.js
"use client";
import { useState } from "react";
import Header from "./Header"; // Assuming Header has a fixed height, e.g., h-16 or h-[73px]
// import Footer from "../Footer"; // Uncomment if you re-add the footer
import LeftSidebar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";
import HomeMidBar from "./HomeMidBar";

export default function MainLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <Header toggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar
          isMobileOpen={isMobileOpen}
          onMobileClose={() => setIsMobileOpen(false)}
        />
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <HomeMidBar />
        </main>
        <div className="hidden xl:flex flex-col w-1/5 max-w-xs 2xl:max-w-[320px] flex-shrink-0 bg-base-100 border-l border-base-300">
          <RightSideBar />
        </div>
      </div>
      {/* <Footer /> */}{" "}
      {/* If you have a footer, consider its placement carefully with h-screen */}
    </div>
  );
}
