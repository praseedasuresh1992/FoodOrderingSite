const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const createCategory = async (categoryData) => {
  const token = localStorage.getItem("adminToken");

  const response = await fetch(`${BASE_URL}/categories/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(categoryData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create category");
  }

  return data;
};