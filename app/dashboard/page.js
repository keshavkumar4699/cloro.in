"use client";
import ButtonAccount from "@/components/ButtonAccount";
import Modal from "@/components/Modal";
import { useState } from "react";

export const dynamic = "force-dynamic";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <main className="min-h-screen p-8 pb-24">
      <section className="max-w-xl mx-auto space-y-8">
        <ButtonAccount />
        <h1 className="text-3xl md:text-4xl font-extrabold">Private Page</h1>
        
        {/* Add a button to open the modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
        >
          Open Modal
        </button>

        {/* Modal component */}
        <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
      </section>
    </main>
  );
}