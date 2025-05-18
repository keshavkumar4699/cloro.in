"use client";
import NavLinks from "./Header/NavLinks";
import Logo from "./Logo";

export default function Sidebar({ isMobileOpen, onMobileClose }) {
  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          aria-hidden="true"
          onClick={onMobileClose}
        ></div>
      )}

      {/* Combined Sidebar/Mobile Menu */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-base-200 border-r border-base-300 transition-transform duration-300 ease-in-out
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          h-[100vh] lg:h-[calc(100vh-73px)] lg:top-[73px]`}
      >
        <div className="h-full overflow-y-auto">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-base-300">
            <Logo />
            <button
              onClick={onMobileClose}
              className="btn btn-ghost btn-sm btn-circle"
              aria-label="Close menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation Content */}
          <div className="p-4 space-y-6">
            {/* Navigation Links */}
            <div className="space-y-2">
              <h2 className="text-sm text-base-content/80 ml-2">
                NAVIGATION
              </h2>
              <NavLinks className="flex-col space-y-1" />
            </div>
            <div className="divider my-2"></div>
            {/* Topics Links */}
            <div className="space-y-2">
              <h2 className="text-sm text-base-content/80 ml-2">
                TOPICS
              </h2>
              <NavLinks className="flex-col space-y-1" />
            </div>
            <div className="divider my-2"></div>
          </div>
        </div>
      </aside>
    </>
  );
}
