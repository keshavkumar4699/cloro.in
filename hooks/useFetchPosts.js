// hooks/useFetchPosts.js
import { useState, useEffect } from 'react';

export function useFetchPosts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/posts");
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ 
          message: "Server error" 
        }));
        throw new Error(
          errData.message || `Failed to fetch posts: ${res.status}`
        );
      }
      const data = await res.json();
      setData(data);
    } catch (error) {
      console.error("Fetch posts error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
}