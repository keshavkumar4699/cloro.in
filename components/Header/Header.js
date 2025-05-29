"use client";
import { useState, useEffect, useCallback } from "react";
import Logo from "../Logo";
import AuthModal from "./AuthModal/AuthModal";
import ButtonSignin from "./ButtonSignin";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import PostModal from "../PostComponents/PostModal";

const Header = ({ toggleMobileMenu }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isAuthModalOpen]);

  const openAuthModal = useCallback((mode) => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const handlePostCreated = () => {
    setIsPostModalOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-base-300">
        <nav className="container flex items-center justify-between px-4 sm:px-6 py-3 mx-auto gap-2 sm:gap-4">
          {/* Left section */}
          <div className="flex items-center gap-2 sm:gap-4 flex-none lg:flex-1">
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden btn btn-ghost btn-square p-2"
              aria-label="Open menu"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="hidden lg:block">
              <Logo />
            </div>
          </div>

          {/* Search Bar - Only collapses on very small screens */}
          <div className={`${showMobileSearch ? 'flex' : 'hidden'} md:flex flex-auto min-w-0 mx-2 sm:mx-4 lg:flex-1 lg:max-w-2xl`}>
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search posts..."
                className={`input w-full pl-10 pr-4 py-3 rounded-3xl transition-colors duration-200 ${
                  isSearchFocused 
                    ? "bg-base-300 border-base-300" 
                    : "bg-base-100 border-base-200"
                } border-2 focus:outline-none focus:ring-0`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Mobile search toggle button - shows when search bar is hidden */}
          <button
            className={`${showMobileSearch ? 'hidden' : 'flex'} md:hidden btn btn-ghost btn-square p-2 ml-auto`}
            onClick={() => setShowMobileSearch(true)}
            aria-label="Search"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>

          {/* Right section */}
          <div className="flex-none lg:flex-1 flex justify-end items-center gap-2">
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="btn btn-primary h-10 px-3 rounded-3xl flex items-center gap-1"
            >
              <PlusIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Create</span>
            </button>
            <ButtonSignin
              onOpenLoginModal={() => openAuthModal("login")}
              extraStyle="btn-primary btn-outline h-10 px-3 rounded-3xl"
            />
          </div>
        </nav>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
      />
      <PostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </>
  );
};

export default Header;