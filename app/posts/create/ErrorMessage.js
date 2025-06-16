"use client";

import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

export default function ErrorMessage({ error }) {
  if (!error) return null;
  
  return (
    <div className="alert alert-error text-sm p-3">
      <ExclamationCircleIcon className="w-5 h-5"/>
      <span>{error}</span>
    </div>
  );
}