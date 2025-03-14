"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const UploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [itemName, setItemName] = useState("");
  const [itemType, setItemType] = useState("top");
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  // Debug function to check local storage
  useEffect(() => {
    const items = localStorage.getItem("wardrobeItems");
    console.log(
      "Current wardrobe items in storage:",
      items ? JSON.parse(items) : []
    );
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    // Create preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Please select a file!");
    if (!itemName) return alert("Please enter a name for the item!");

    try {
      setIsUploading(true);
      console.log("Starting upload process...");

      // Get existing wardrobe items
      const existingItems = JSON.parse(
        localStorage.getItem("wardrobeItems") || "[]"
      );
      console.log("Existing items:", existingItems);

      // Create new item
      const newItem = {
        id: Date.now().toString(),
        name: itemName,
        type: itemType,
        imageUrl: preview,
        dateAdded: new Date().toISOString(),
      };
      console.log("New item to add:", newItem);

      // Add new item to array
      const updatedItems = [...existingItems, newItem];

      // Save to local storage
      localStorage.setItem("wardrobeItems", JSON.stringify(updatedItems));
      console.log("Updated wardrobe items:", updatedItems);

      // Dispatch a custom event to notify other components
      const event = new Event("wardrobeUpdated");
      window.dispatchEvent(event);
      console.log("Dispatched wardrobeUpdated event");

      // Reset form
      setSelectedFile(null);
      setItemName("");
      setItemType("top");
      setPreview(null);
      setIsUploading(false);

      // Show success message
      alert("Item added to your wardrobe!");

      // Force refresh to update the UI
      router.refresh();

      // Check if items were actually saved
      const checkStorage = localStorage.getItem("wardrobeItems");
      console.log(
        "Verification - Items in storage after save:",
        checkStorage ? JSON.parse(checkStorage) : []
      );
    } catch (error) {
      console.error("Error saving to local storage:", error);
      alert("Failed to save item. Please try again.");
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Add New Item to Wardrobe</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Item Name:</label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="E.g., Blue T-Shirt"
            disabled={isUploading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Item Type:</label>
          <select
            value={itemType}
            onChange={(e) => setItemType(e.target.value)}
            className="w-full border p-2 rounded"
            disabled={isUploading}
          >
            <option value="top">Top (Shirt, T-shirt, etc.)</option>
            <option value="bottom">Bottom (Pants, Skirt, etc.)</option>
            <option value="outerwear">Outerwear (Jacket, Coat, etc.)</option>
            <option value="footwear">Footwear (Shoes, Boots, etc.)</option>
            <option value="accessory">Accessory</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Upload Image:
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="border p-2 w-full rounded"
            accept="image/*"
            disabled={isUploading}
          />
        </div>

        {preview && (
          <div className="mt-2">
            <p className="text-sm font-medium mb-1">Preview:</p>
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover border"
            />
          </div>
        )}

        <button
          type="submit"
          className={`w-full p-2 rounded ${
            isUploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
          disabled={isUploading}
        >
          {isUploading ? "Adding to Wardrobe..." : "Add to Wardrobe"}
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
