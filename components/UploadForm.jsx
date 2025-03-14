"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/lib/imagekit";
import { addWardrobeItem } from "@/lib/appwrite";

const UploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [itemName, setItemName] = useState("");
  const [itemType, setItemType] = useState("top");
  const [preview, setPreview] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

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
      setImageUrl("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Please select a file!");
    if (!itemName) return alert("Please enter a name for the item!");

    try {
      setIsUploading(true);
      console.log("Starting upload process...");

      // Upload image to ImageKit
      const fileName = `${Date.now()}-${selectedFile.name}`;
      const uploadedImageUrl = await uploadImage(selectedFile, fileName);
      setImageUrl(uploadedImageUrl);
      console.log("Image uploaded:", uploadedImageUrl);

      // Create item in Appwrite
      const newItem = {
        name: itemName,
        type: itemType,
        imageUrl: uploadedImageUrl,
        dateAdded: new Date().toISOString(),
      };

      const result = await addWardrobeItem(newItem);
      console.log("Item added to database:", result);

      // Reset form
      setSelectedFile(null);
      setItemName("");
      setItemType("top");
      setPreview(null);
      setImageUrl("");
      setIsUploading(false);

      // Show success message
      alert("Item added to your wardrobe!");

      // Force refresh to update the UI
      router.refresh();
    } catch (error) {
      console.error("Error saving item:", error);
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

        {imageUrl && (
          <div>
            <label className="block text-sm font-medium mb-1">Image URL:</label>
            <input
              type="text"
              value={imageUrl}
              readOnly
              className="w-full border p-2 rounded bg-gray-50"
            />
          </div>
        )}

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
