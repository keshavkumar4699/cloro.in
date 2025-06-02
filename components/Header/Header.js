"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Logo from "../Logo";
import AuthModal from "./AuthModal/AuthModal";
import ButtonSignin from "./ButtonSignin";
import { PlusIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";

const Header = ({ toggleMobileMenu }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showMobileSearchInput, setShowMobileSearchInput] = useState(false);
  const router = useRouter();
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isAuthModalOpen || showMobileSearchInput) { // Lock scroll if modal or mobile search is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isAuthModalOpen, showMobileSearchInput]);

  useEffect(() => {
    if (showMobileSearchInput && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showMobileSearchInput]);

  const openAuthModal = useCallback((mode) => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      if (showMobileSearchInput) {
        setShowMobileSearchInput(false); 
      }
    }
  };

  const handleCreatePostClick = () => {
    router.push('/posts/create');
  };

  const toggleMobileSearchVisibility = () => {
    setShowMobileSearchInput(!showMobileSearchInput);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100">
        <nav className="container flex items-center justify-between px-4 sm:px-6 py-3 mx-auto gap-2">
          {/* Left Group: Burger menu and Logo */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden btn btn-ghost btn-square p-2"
              aria-label="Open menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {/* Logo: Hidden on small screens when mobile search input is active */}
            <div className={`${showMobileSearchInput ? 'hidden' : 'flex'} md:flex items-center`}>
              <Logo />
            </div>
          </div>

          {/* Center Group: Main Search Bar (visible on md screens and up, hidden if mobile search is active) */}
          {!showMobileSearchInput && (
            <div className="hidden md:flex flex-auto min-w-0 mx-2 sm:mx-4 lg:flex-1 lg:max-w-2xl">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  placeholder="Search posts..."
                  className={`input input-bordered w-full pl-10 pr-4 py-2.5 rounded-full text-sm transition-colors duration-200 ${
                    isSearchFocused ? "bg-base-200 border-primary" : "bg-base-100 border-base-300"
                  } focus:outline-none focus:ring-1 focus:ring-primary`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/60 hover:text-primary"
                  aria-label="Search"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
              </form>
            </div>
          )}

          {/* Right Group: Mobile Search Toggle, Create, Auth Buttons */}
          {/* This entire group is hidden if the mobile search input overlay is active */}
          {!showMobileSearchInput && (
            <div className="flex items-center gap-1 sm:gap-2"> {/* Adjusted gap for potentially 3 icons */}
              {/* Mobile Search Toggle Button - visible only on mobile (md:hidden) */}
              <button
                className="md:hidden btn btn-ghost btn-square p-2"
                onClick={toggleMobileSearchVisibility}
                aria-label="Open search"
              >
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>

              {/* Create Post Button */}
              <button
                onClick={handleCreatePostClick}
                className="btn btn-primary h-10 min-h-[2.5rem] px-3 rounded-full flex items-center gap-1.5 whitespace-nowrap" // Ensured consistent height
              >
                <PlusIcon className="h-5 w-5" />
                <span>Create</span> {/* Text is always visible */}
              </button>

              {/* Auth Button/Component */}
              <ButtonSignin
                onOpenLoginModal={() => openAuthModal("login")}
                extraStyle="btn-primary btn-outline h-10 min-h-[2.5rem] px-3 rounded-full whitespace-nowrap" // Ensured consistent height
              />
            </div>
          )}
        </nav>

        {/* Mobile Search Input Overlay (covers header content on mobile when active) */}
        {showMobileSearchInput && (
          <div className="md:hidden absolute top-0 left-0 right-0 w-full z-50 bg-base-100 p-3 border-b border-base-300 shadow-lg"> {/* Added shadow-lg */}
            <form onSubmit={handleSearch} className="relative w-full flex items-center gap-2">
              <button // Search icon inside input bar
                type="submit"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/60 hover:text-primary"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search all posts..."
                className="input input-bordered flex-grow pl-10 pr-4 py-2.5 rounded-full text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                autoComplete="off"
              />
              <button
                type="button"
                onClick={toggleMobileSearchVisibility}
                className="btn btn-ghost btn-square p-2"
                aria-label="Close search"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </form>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
      />
    </>
  );
};

export default Header;