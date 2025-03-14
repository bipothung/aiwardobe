"use client";
import { useState, useEffect } from "react";

// OutfitSuggestions.jsx
// This file will contain the outfit suggestions component

const OutfitSuggestions = () => {
  const [suggestedOutfits, setSuggestedOutfits] = useState([]);
  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Load wardrobe items from local storage
    const loadItemsFromStorage = () => {
      try {
        const storedItems = JSON.parse(
          localStorage.getItem("wardrobeItems") || "[]"
        );
        setWardrobeItems(storedItems);

        // Generate outfits if we have enough items
        if (storedItems.length >= 2) {
          generateOutfits(storedItems);
        }
      } catch (error) {
        console.error("Error loading from local storage:", error);
        setWardrobeItems([]);
        setSuggestedOutfits([]);
      }
    };

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

  // Function to generate intelligent outfit combinations
  const generateOutfits = (items) => {
    if (items.length < 2) return;
    setIsGenerating(true);

    try {
      // Group items by type
      const tops = items.filter((item) => item.type === "top" || !item.type);
      const bottoms = items.filter(
        (item) => item.type === "bottom" || !item.type
      );
      const outerwear = items.filter((item) => item.type === "outerwear");
      const accessories = items.filter((item) => item.type === "accessory");

      let generatedOutfits = [];
      const maxOutfits = 5;

      // Create top + bottom combinations
      if (tops.length > 0 && bottoms.length > 0) {
        for (
          let i = 0;
          i < Math.min(maxOutfits, tops.length * bottoms.length);
          i++
        ) {
          const randomTop = tops[Math.floor(Math.random() * tops.length)];
          const randomBottom =
            bottoms[Math.floor(Math.random() * bottoms.length)];

          // Maybe add outerwear (30% chance if available)
          let outfitItems = [randomTop, randomBottom];

          if (outerwear.length > 0 && Math.random() < 0.3) {
            const randomOuterwear =
              outerwear[Math.floor(Math.random() * outerwear.length)];
            outfitItems.push(randomOuterwear);
          }

          // Maybe add an accessory (20% chance if available)
          if (accessories.length > 0 && Math.random() < 0.2) {
            const randomAccessory =
              accessories[Math.floor(Math.random() * accessories.length)];
            outfitItems.push(randomAccessory);
          }

          generatedOutfits.push({
            id: `outfit-${Date.now()}-${i}`,
            items: outfitItems,
            score: Math.floor(Math.random() * 100), // Random style score
          });
        }
      }
      // If we don't have proper categories, fall back to random pairs
      else {
        const shuffled = [...items].sort(() => 0.5 - Math.random());
        for (
          let i = 0;
          i < Math.min(maxOutfits, Math.floor(items.length / 2));
          i++
        ) {
          const outfitItems = shuffled.slice(i * 2, i * 2 + 2);

          generatedOutfits.push({
            id: `outfit-${Date.now()}-${i}`,
            items: outfitItems,
            score: Math.floor(Math.random() * 100), // Random style score
          });
        }
      }

      // Sort by score (highest first)
      generatedOutfits.sort((a, b) => b.score - a.score);

      setSuggestedOutfits([...generatedOutfits]);
    } catch (error) {
      console.error("Error generating outfits:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateMore = () => {
    if (wardrobeItems.length >= 2) {
      generateOutfits(wardrobeItems);
    }
  };

  if (wardrobeItems.length < 2 && suggestedOutfits.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Not Enough Items</h2>
        <p className="text-gray-600">
          Add at least 2 items to your wardrobe to get outfit suggestions.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Suggested Outfits</h2>
        <button
          onClick={handleGenerateMore}
          className={`px-4 py-2 rounded text-sm ${
            isGenerating
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate More"}
        </button>
      </div>

      <div className="space-y-4">
        {suggestedOutfits.map((outfit, index) => (
          <div
            key={outfit.id || index}
            className="border rounded-lg p-4 bg-white shadow-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Outfit #{index + 1}</h3>
              {outfit.score && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Style Score: {outfit.score}%
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {outfit.items.map((item, i) => (
                <div key={i} className="relative">
                  <img
                    src={item.imageUrl}
                    alt={item.name || `Item ${i + 1}`}
                    className="w-24 h-24 object-cover rounded border"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                  {item.name && (
                    <span className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center truncate">
                      {item.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutfitSuggestions;
