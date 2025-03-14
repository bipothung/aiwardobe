// WardrobeGallery.jsx
// This file will contain the gallery of wardrobe items

"use client";
import { useState, useEffect } from "react";
import { getWardrobeItems, deleteWardrobeItem } from "@/lib/appwrite";

const WardrobeGallery = () => {
  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load items from Appwrite
  const loadItems = async () => {
    try {
      console.log("Loading items from Appwrite...");
      const items = await getWardrobeItems();
      console.log("Retrieved items:", items);
      setWardrobeItems(items);
      filterItems(items, activeFilter);
    } catch (error) {
      console.error("Error loading from Appwrite:", error);
      setWardrobeItems([]);
      setFilteredItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter items based on selected category
  const filterItems = (items, filter) => {
    console.log("Filtering items with filter:", filter);
    if (filter === "all") {
      setFilteredItems(items);
    } else {
      const filtered = items.filter((item) => item.type === filter);
      console.log("Filtered items:", filtered);
      setFilteredItems(filtered);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  // Update filtered items when filter changes
  useEffect(() => {
    filterItems(wardrobeItems, activeFilter);
  }, [activeFilter, wardrobeItems]);

  // Handle item deletion
  const handleDeleteItem = async (itemId) => {
    try {
      console.log("Deleting item:", itemId);
      await deleteWardrobeItem(itemId);
      console.log("Item deleted successfully");
      loadItems(); // Reload items after deletion
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Loading...</h2>
      </div>
    );
  }

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
        {filteredItems.map((item) => (
          <div
            key={item.$id}
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
            <p className="text-center text-xs text-gray-500 capitalize">
              {item.type}
            </p>

            <button
              onClick={() => handleDeleteItem(item.$id)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete item"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WardrobeGallery;
