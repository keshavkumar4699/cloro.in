// context/AuthModalContext.js
"use client";

import { createContext, useState, useContext, useMemo } from 'react';
import AuthModal from '@/components/Auth/AuthModal/AuthModal'; // Your AuthModal component

const AuthModalContext = createContext(null);

export const AuthModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [callbackUrl, setCallbackUrl] = useState('/');

  const openModal = (initialMode = 'login', url = window.location.pathname) => {
    setMode(initialMode);
    setCallbackUrl(url);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  // useMemo ensures the context value object is stable
  const value = useMemo(() => ({
    isOpen,
    mode,
    callbackUrl,
    openModal,
    closeModal,
  }), [isOpen, mode, callbackUrl]);

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      {/* Render the modal globally here */}
      <AuthModal />
    </AuthModalContext.Provider>
  );
};

// Custom hook to easily use the context
export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};