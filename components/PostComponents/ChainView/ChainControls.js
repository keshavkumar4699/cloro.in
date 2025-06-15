// components/PostComponents/ChainView/ChainControls.jsx
"use client";

export default function ChainControls({ 
  sortOrder, 
  onSortChange, 
  showSort 
}) {
  if (!showSort) return null;

  return (
    <div className="flex justify-end">
      <select
        value={sortOrder}
        onChange={(e) => onSortChange(e.target.value)}
        className="select select-bordered select-sm"
      >
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
      </select>
    </div>
  );
}