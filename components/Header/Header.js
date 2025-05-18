"use client";
import { useState, useEffect, useCallback } from "react";
import Logo from "../Logo";
import NavLinks from "./NavLinks";
import AuthModal from "./AuthModal/AuthModal";
import ButtonSignin from "../ButtonSignin";

const Header = ({ toggleMobileMenu }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isAuthModalOpen]);

  const openAuthModal = useCallback((mode) => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  return (
    <>
      <header className="bg-base-200 sticky top-0 z-40 border-b border-base-300">
        <nav className="container flex items-center justify-between px-6 py-4 mx-auto">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button 
              onClick={toggleMobileMenu}
              className="lg:hidden btn btn-ghost btn-square"
              aria-label="Open menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Logo />
          </div>
          
          <div className="flex items-center gap-2">
            <ButtonSignin 
              onOpenLoginModal={() => openAuthModal('login')} 
              extraStyle="btn-primary btn-outline btn-sm"
            />
          </div>
        </nav>
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