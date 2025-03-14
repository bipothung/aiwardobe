// Wardrobe Page
import WardrobeGallery from "@/components/WardrobeGallery";
import UploadForm from "@/components/UploadForm";

export default function Wardrobe() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 mt-4 px-4">My Wardrobe</h1>

      <div className="grid md:grid-cols-3 gap-6 px-4">
        <div className="md:col-span-2">
          <WardrobeGallery clothes={[]} />
        </div>

        <div>
          <UploadForm />
        </div>
      </div>
    </div>
  );
}
