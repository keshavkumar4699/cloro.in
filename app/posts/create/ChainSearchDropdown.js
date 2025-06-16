"use client";

import { useState, useRef, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { debounce } from "lodash";

export default function ChainSearchDropdown({
  selectedChain,
  setSelectedChain,
  isSubmitting,
}) {
  const [chainSearchInput, setChainSearchInput] = useState("");
  const [chainSearchResults, setChainSearchResults] = useState([]);
  const [isChainSearching, setIsChainSearching] = useState(false);
  const [showChainDropdown, setShowChainDropdown] = useState(false);

  const chainSearchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chainSearchRef.current && !chainSearchRef.current.contains(event.target)) {
        setShowChainDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced chain search
  const debouncedChainSearch = useRef(
    debounce(async (searchTerm) => {
      if (searchTerm.trim().length < 1) {
        setChainSearchResults([]);
        setIsChainSearching(false);
        return;
      }
      setIsChainSearching(true);
      try {
        const response = await fetch(`/api/posts/chains?search=${encodeURIComponent(searchTerm)}&limit=5`);
        if (!response.ok) throw new Error("Failed to fetch chains");
        let results = await response.json();
        const exactMatchExists = results.some(c => c.title.toLowerCase() === searchTerm.trim().toLowerCase());
        if (!exactMatchExists) {
            results.unshift({ _id: "create_new_chain_option", title: searchTerm.trim(), isCreateOption: true });
        }
        setChainSearchResults(results);
      } catch (err) {
        console.error("Chain search failed:", err);
      } finally {
        setIsChainSearching(false);
      }
    }, 300)
  ).current;

  useEffect(() => {
    debouncedChainSearch(chainSearchInput);
  }, [chainSearchInput, debouncedChainSearch]);

  const handleChainSelect = (chain) => {
    setSelectedChain(chain);
    setChainSearchInput(chain.title);
    setShowChainDropdown(false);
  };

  return (
    <div className="form-control" ref={chainSearchRef}>
      <div className="relative">
        <input
          type="text"
          className="input input-bordered w-full pl-4 pr-10 text-sm"
          value={chainSearchInput}
          onChange={(e) => {
            setChainSearchInput(e.target.value);
            setShowChainDropdown(true);
          }}
          onFocus={() => setShowChainDropdown(true)}
          placeholder="Search or create a chain (optional)"
          disabled={isSubmitting}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={() => setShowChainDropdown(!showChainDropdown)}
          disabled={isSubmitting}
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {showChainDropdown && (
        <div ref={dropdownRef} className="absolute z-10 mt-1 bg-base-100 border border-base-200 rounded-lg shadow-lg max-h-60 overflow-auto mt-10">
          {isChainSearching ? (
            <div className="p-2 text-sm text-center">Searching...</div>
          ) : chainSearchResults.length === 0 ? (
            <div className="p-2 text-sm text-center">No results found</div>
          ) : (
            chainSearchResults.map((chain) => (
              <div
                key={chain._id}
                className={`p-2 text-sm cursor-pointer hover:bg-base-200 ${selectedChain?._id === chain._id ? 'bg-base-200' : ''}`}
                onClick={() => handleChainSelect(chain)}
              >
                {chain.isCreateOption ? (
                  <div className="flex items-center gap-2">
                    <PlusIcon className="w-4 h-4" />
                    <span>Create &quot;{chain.title}&quot;</span>
                  </div>
                ) : (
                  chain.title
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}