"use client";
import { useState } from "react";
import Header from "./Header/Header";
import Footer from "./Footer";
import Sidebar from "./SideBar";

export default function MainLayout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with border bottom */}
      <Header toggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)} />
      
      <div className="flex flex-1">
        {/* Combined Sidebar */}
        <Sidebar 
          isMobileOpen={isMobileOpen} 
          onMobileClose={() => setIsMobileOpen(false)} 
        />
        
        {/* Main Content with proper spacing */}
        <main className="flex-1 p-6 lg:ml-64 min-h-[calc(100vh-73px)]">
          {children}
        </main>

        {/* Right Sidebar - Only on XL screens */}
        <aside className="hidden xl:block w-80 border px-4 py-6">
          <h2 className="text-xs font-semibold mb-4 text-base-content/80">TRENDING</h2>
          <div className="space-y-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-base-200 rounded-lg hover:bg-base-300 transition-colors p-2">
                <h3 className="font-small">Trending Post {item}</h3>
                <p className="text-sm text-base-content/60 mt-1">1,24{item} views</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
      
      <Footer />
    </div>
  );
}