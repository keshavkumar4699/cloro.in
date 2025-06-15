// components/PostComponents/ChainView/ChainStats.jsx
"use client";

export default function ChainStats({ 
  postCount, 
  followersCount = 0, 
  views = 0 
}) {
  return (
    <div className="flex justify-between items-center text-xs text-base-content/80 mt-2 px-1 sm:px-4 md:px-8">
      <StatItem value={postCount} label="Post" plural="Posts" />
      <StatItem value={followersCount} label="Follower" plural="Followers" />
      <StatItem value={views} label="View" plural="Views" />
    </div>
  );
}

function StatItem({ value, label, plural }) {
  const displayValue = value?.toLocaleString() || 0;
  const displayLabel = value === 1 ? label : plural;
  
  return (
    <div className="text-center transition-transform duration-300 ease-out motion-safe:hover:scale-105">
      <span className="font-semibold">{displayValue}</span>
      <span className="ml-1 text-base-content/70">{displayLabel}</span>
    </div>
  );
}