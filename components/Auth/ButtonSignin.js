// components/Auth/ButtonSignin.jsx
"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useAuthModal } from "@/context/AuthModalContext";
import { useRouter } from "next/navigation";

const ButtonSignin = ({ text = "Sign In", extraStyle }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { openModal } = useAuthModal();

  const handleClick = () => {
    if (status === "authenticated") {
      router.push("/dashboard"); // Or your default authenticated route
    } else {
      openModal("login");
    }
  };

  if (status === "authenticated") {
    return (
      <Link
        href="/dashboard"
        className={`btn ${extraStyle ? extraStyle : ""}`}
      >
        {session.user?.image ? (
          <img
            src={session.user?.image}
            alt={session.user?.name || "Account"}
            className="w-6 h-6 rounded-full shrink-0"
            referrerPolicy="no-referrer"
            width={24}
            height={24}
          />
        ) : (
          <span className="w-6 h-6 bg-base-300 flex justify-center items-center rounded-full shrink-0">
            {session.user?.name?.charAt(0) || session.user?.email?.charAt(0)}
          </span>
        )}
        {session.user?.name || session.user?.email || "Account"}
      </Link>
    );
  }

  return (
    <button
      className={`btn ${extraStyle ? extraStyle : ""}`}
      onClick={handleClick}
    >
      {text}
    </button>
  );
};

export default ButtonSignin;