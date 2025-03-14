// Outfit Suggestions Page
import OutfitSuggestions from "@/components/OutfitSuggestions";

export default function Outfit() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 mt-4 px-4">Outfit Suggestions</h1>
      <div className="px-4">
        <OutfitSuggestions outfits={[]} />
      </div>
    </div>
  );
}
