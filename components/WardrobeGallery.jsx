// WardrobeGallery.jsx
// This file will contain the gallery of wardrobe items

"use client";
import { useState, useEffect } from "react";

const WardrobeGallery = () => {
  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [filteredItems, setFilteredItems] = useState([]);

  // Load items from local storage
  const loadItemsFromStorage = () => {
    try {
      const storedItems = JSON.parse(
        localStorage.getItem("wardrobeItems") || "[]"
      );
      setWardrobeItems(storedItems);
      filterItems(storedItems, activeFilter);
    } catch (error) {
      console.error("Error loading from local storage:", error);
      setWardrobeItems([]);
      setFilteredItems([]);
    }
  };

  // Filter items based on selected category
  const filterItems = (items, filter) => {
    if (filter === "all") {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter((item) => item.type === filter));
    }
  };

  useEffect(() => {
    // Initial load
    loadItemsFromStorage();

    // Add event listeners for storage changes
    const handleStorageChange = () => {
      loadItemsFromStorage();
    };

    const handleWardrobeUpdate = () => {
      loadItemsFromStorage();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("wardrobeUpdated", handleWardrobeUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("wardrobeUpdated", handleWardrobeUpdate);
    };
  }, []);

  // Update filtered items when filter changes
  useEffect(() => {
    filterItems(wardrobeItems, activeFilter);
  }, [activeFilter, wardrobeItems]);

  // Handle item deletion
  const handleDeleteItem = (itemId) => {
    try {
      const storedItems = JSON.parse(
        localStorage.getItem("wardrobeItems") || "[]"
      );
      const updatedItems = storedItems.filter((item) => item.id !== itemId);
      localStorage.setItem("wardrobeItems", JSON.stringify(updatedItems));
      loadItemsFromStorage();

      // Dispatch event to notify other components
      const event = new Event("wardrobeUpdated");
      window.dispatchEvent(event);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  if (wardrobeItems.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Your Wardrobe is Empty</h2>
        <p className="text-gray-600">Add some clothes to get started!</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          My Wardrobe ({wardrobeItems.length} items)
        </h2>

        <div className="flex space-x-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1 rounded text-sm ${
              activeFilter === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter("top")}
            className={`px-3 py-1 rounded text-sm ${
              activeFilter === "top"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Tops
          </button>
          <button
            onClick={() => setActiveFilter("bottom")}
            className={`px-3 py-1 rounded text-sm ${
              activeFilter === "bottom"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Bottoms
          </button>
          <button
            onClick={() => setActiveFilter("footwear")}
            className={`px-3 py-1 rounded text-sm ${
              activeFilter === "footwear"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Footwear
          </button>
          <button
            onClick={() => setActiveFilter("outerwear")}
            className={`px-3 py-1 rounded text-sm ${
              activeFilter === "outerwear"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Outerwear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item, index) => (
          <div
            key={item.id || index}
            className="border rounded-lg p-2 bg-white shadow-sm hover:shadow-md transition-shadow relative group"
          >
            <div className="aspect-square overflow-hidden rounded">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder-image.jpg";
                }}
              />
            </div>
            <p className="text-center mt-2 font-medium">{item.name}</p>
            {item.type && (
              <p className="text-center text-xs text-gray-500 capitalize">
                {item.type}
              </p>
            )}

            {/* Delete button - only show for user-added items */}
            {item.id && (
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete item"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WardrobeGallery;
