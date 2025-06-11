// hooks/useProtectedAction.js
"use client";

import { useSession } from "next-auth/react";
import { useAuthModal } from "@/context/AuthModalContext";

export const useProtectedAction = () => {
  const { status } = useSession();
  const { openModal } = useAuthModal();

  const performProtectedAction = (actionCallback) => {
    if (status === "authenticated") {
      // If user is logged in, perform the action
      actionCallback();
    } else {
      // If not logged in, open the login modal
      // The modal will redirect back to the current page on success
      openModal("login", window.location.href);
    }
  };

  return performProtectedAction;
};