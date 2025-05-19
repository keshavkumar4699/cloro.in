// LeftSideBar.js
"use client";
import NavLinks from "../Header/NavLinks"; // Assuming NavLinks is styled appropriately for vertical layout
import Logo from "../Logo";
import { XMarkIcon } from '@heroicons/react/24/solid'; // For a clearer close icon

export default function LeftSidebar({ isMobileOpen, onMobileClose }) {
  // Assuming header height is 73px for calc. Adjust if your Header's height is different.
  // Or use a CSS variable if you prefer.
  const headerHeight = '73px'; 

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ease-in-out"
          aria-hidden="true"
          onClick={onMobileClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-45 w-64 bg-base-100 border-r border-base-300
          transition-transform duration-300 ease-in-out
          flex flex-col lg:flex-shrink-0 
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          h-screen lg:h-[calc(100vh-${headerHeight})] lg:top-[${headerHeight}] 
        `}
        // Note: `h-screen lg:h-[calc(100vh-${headerHeight})]` means it's full height on mobile (fixed),
        // and full available height minus header on desktop (static).
        // If Header is part of MainLayout's flex, then lg:h-full might be enough if parent provides context.
        // Given the structure of MainLayout, this height calculation should work for lg:static.
      >
        {/* Mobile Header in Sidebar */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-base-300">
          <Logo />
          <button
            onClick={onMobileClose}
            className="btn btn-ghost btn-sm btn-circle"
            aria-label="Close menu"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        {/* Desktop Logo/Header (Optional, if you want one above nav links on desktop) */}
        {/* <div className="hidden lg:flex items-center p-4 border-b border-base-300">
            <Logo />
        </div> */}

        {/* Navigation Content - This part scrolls */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar"> {/* Added flex-1 here */}
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-base-content/70 px-2 tracking-wider uppercase">Navigation</h2>
            <NavLinks className="flex-col space-y-1" navLinkClassName="p-2 hover:bg-base-200 rounded-md" /> {/* Pass item styling */}
          </div>
          
          <div className="divider my-2"></div>
          
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-base-content/70 px-2 tracking-wider uppercase">Topics</h2>
            {/* Replace with actual topic links/components */}
            <ul className="flex-col space-y-1">
                {['Technology', 'Science', 'Art', 'Gaming'].map(topic => (
                    <li key={topic}>
                        <a href="#" className="block p-2 text-sm hover:bg-base-200 rounded-md transition-colors">
                            {topic}
                        </a>
                    </li>
                ))}
            </ul>
          </div>
          <div className="divider my-2"></div>
        </div>

        {/* Optional: Sidebar Footer Content */}
        <div className="p-4 border-t border-base-300 mt-auto">
            <p className="text-xs text-base-content/60 text-center">© {new Date().getFullYear()} Your App</p>
        </div>
      </aside>
    </>
  );
}