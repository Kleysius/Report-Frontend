import { PhotoIcon } from "@heroicons/react/24/outline";

const ImageUploadButton = ({
  entry,
  index,
  onChange,
  variant = "anomaly",
  isValid = false,
}) => {
  const color = isValid
    ? "text-green-600 hover:text-green-700"
    : variant === "safety"
    ? "text-red-600 hover:text-red-800"
    : "text-indigo-500 hover:text-indigo-700";

  const images = entry.images || [];

  return (
    <div className="relative flex items-center gap-2 group">
      {/* 🖼️ Bouton Upload */}
      <label className="flex items-center gap-1 cursor-pointer">
        <PhotoIcon className={`w-5 h-5 ${color}`} />
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => onChange(index, e)}
        />
        <span className={`text-sm ${color}`}>Ajouter</span>
      </label>

      {/* 🔢 Badge si images ajoutées */}
      {images.length > 0 && (
        <span className="absolute -top-3 right-10 bg-green-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-md">
          {images.length}
        </span>
      )}
    </div>
  );
};

export default ImageUploadButton;
