// components/Auth/AuthModal/AuthModal.js
"use client";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useAuthModal } from "@/context/AuthModalContext";
import { useRouter } from "next/navigation";

export default function AuthModal()  {
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
    router.replace(callbackUrl||'/');
    router.refresh();
  };

  return (
    <dialog id="auth_modal" className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box w-11/12 max-w-md p-6 md:p-8 rounded-lg shadow-xl bg-base-100 relative">
        <button 
          type="button"
          onClick={closeModal}
          className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 z-10"
        >
          ✕
        </button>

        {mode === 'login' ? (
          <LoginForm 
            onSuccess={handleSuccess}
            onSwitchToRegister={() => openModal("register", callbackUrl)} // Use the destructured openModal
          />
        ) : (
          <RegisterForm 
            onSuccess={handleSuccess}
            onSwitchToLogin={() => openModal("login", callbackUrl)} // Use the destructured openModal
          />
        )}
      </div>
      
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={closeModal}>close</button>
      </form>
    </dialog>
  );
}