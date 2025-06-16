// data/categories.js
export const categories = [
  { key: 1, href: "/#Business", label: "Business", value: "business" },
  { key: 2, href: "/#Entertainment", label: "Entertainment", value: "entertainment" },
  { key: 3, href: "/#Health", label: "Health", value: "health" },
  { key: 4, href: "/#Politics", label: "Politics", value: "politics" },
  { key: 5, href: "/#Sports", label: "Sports", value: "sports" },
];

// Generate enum values automatically
export const categoryValues = categories.map(cat => cat.value);