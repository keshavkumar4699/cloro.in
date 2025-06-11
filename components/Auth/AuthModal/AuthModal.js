// components/Auth/AuthModal/AuthModal.js
"use client";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useAuthModal } from "@/context/AuthModalContext";
import { useRouter } from "next/navigation";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function AuthModal() {
  const { 
    isOpen, 
    mode, 
    closeModal, 
    callbackUrl,
    openModal,
  } = useAuthModal();
  
  const router = useRouter();

  const handleSuccess = () => {
    closeModal();
    router.replace(callbackUrl || '/');
    router.refresh(); // Refreshes server components to reflect new auth state
  };

  return (
    // Headless UI Transition controls the open/close state and animations
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        // We use Headless UI's Dialog for accessibility and state management,
        // but we'll style its children using DaisyUI's classes.
        className="relative z-50"
        onClose={closeModal}
      >
        {/* Animated Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {/* This is the DaisyUI modal-backdrop, but animated */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        {/* This div centers the modal on the screen */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            
            {/* The Modal Panel with the new "slide and fade" transition */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 -translate-y-10" // Start transparent and slightly above
              enterTo="opacity-100 translate-y-0"   // End opaque and in final position
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0" // Start opaque and in final position
              leaveTo="opacity-0 -translate-y-10"   // End transparent and slightly above
            >
              {/*
                IMPORTANT: We use Dialog.Panel but style it with DaisyUI's "modal-box".
                This restores the exact size, shape, and padding you liked.
              */}
              <Dialog.Panel className="modal-box w-11/12 max-w-md relative">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10"
                  aria-label="Close"
                >
                  ✕
                </button>

                {/* The Login/Register forms render inside the modal-box */}
                {mode === 'login' ? (
                  <LoginForm 
                    onSuccess={handleSuccess}
                    onSwitchToRegister={() => openModal("register", callbackUrl)}
                  />
                ) : (
                  <RegisterForm 
                    onSuccess={handleSuccess}
                    onSwitchToLogin={() => openModal("login", callbackUrl)}
                  />
                )}
              </Dialog.Panel>
            </Transition.Child>

          </div>
        </div>
      </Dialog>
    </Transition>
  );
}