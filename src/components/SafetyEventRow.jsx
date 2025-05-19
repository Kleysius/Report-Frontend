import ImageUploadButton from "./ImageUploadButton";

const SafetyEventRow = ({
  index,
  event,
  onUpdate,
  onRemove,
  canDelete,
  removingIndex,
}) => {
  const types = [
    "Sécurité machine",
    "Infrastructure",
    "EPI",
    "Comportement",
    "Autre",
  ];

  const isValid = event.type && event.description;

  return (
    <tr
      className={`transition-colors duration-500 ease-in-out min-h-[64px] ${
        removingIndex === index ? "animate-fade-out" : "animate-slide-fade-in"
      } ${
        isValid
          ? "bg-green-50 dark:bg-green-400/20"
          : "bg-red-100 dark:bg-red-100/10"
      }`}
    >
      {/* 🏷️ Type */}
      <td className="p-2 w-1/5 rounded-l-md">
        <select
          name={`type-${index}`}
          value={event.type}
          onChange={(e) => onUpdate(index, "type", e.target.value)}
          className={`w-full px-2 py-1 border rounded-md text-sm transition-colors duration-500 ease-in-out
      bg-white dark:bg-gray-900 dark:text-white
      ${
        isValid
          ? "border-green-500 dark:border-green-400"
          : "border-red-400 dark:border-red-500/50"
      }`}
          title="Type d'événement"
        >
          <option value="">Type</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </td>

      {/* 📝 Description */}
      <td className="pr-2 w-3/5">
        <div className="flex items-center">
          <textarea
            name={`description-${index}`}
            value={event.description}
            onChange={(e) => onUpdate(index, "description", e.target.value)}
            rows="1"
            placeholder="Décris l'observation..."
            className={`w-full px-2 py-1 border rounded-md text-sm resize-none overflow-hidden min-h-[31px]
        transition-colors duration-500 ease-in-out
        bg-white dark:bg-gray-900 dark:text-white
        ${
          isValid
            ? "border-green-500 dark:border-green-400"
            : "border-red-400 dark:border-red-500/50"
        }`}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
          />
        </div>
      </td>

      {/* 🖼️ Images avec aperçu au hover */}
      <td className="w-1/5 align-center">
        <div
          className="relative flex items-center group"
          onMouseMove={(e) => {
            const x = e.clientX;
            const y = e.clientY;
            document.documentElement.style.setProperty("--hover-x", `${x}px`);
            document.documentElement.style.setProperty("--hover-y", `${y}px`);
          }}
        >
          <ImageUploadButton
            entry={event}
            index={index}
            onChange={(index, e) => {
              const files = Array.from(e.target.files);
              if (files.length === 0) return;

              const readers = files.map(
                (file) =>
                  new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(file);
                  })
              );

              Promise.all(readers).then((results) => {
                const newImages = Array.isArray(event.images)
                  ? [...event.images, ...results]
                  : [...results];
                onUpdate(index, "images", newImages);
              });
            }}
            variant="safety"
            isValid={isValid}
          />

          {/* aperçu au hover */}
          {event?.images?.length > 0 && (
            <div
              className="fixed z-50 hidden group-hover:flex gap-2 bg-white dark:bg-gray-900 p-2 rounded-md shadow-lg dark:shadow-black/40 border border-gray-300 dark:border-gray-700"
              style={{
                top: "calc(var(--hover-y, 0px) - 140px)",
                left: "calc(var(--hover-x, 0px) - 100px)",
              }}
            >
              {event.images.slice(0, 6).map((imgSrc, i) => (
                <img
                  key={i}
                  src={imgSrc}
                  alt={`Aperçu ${i + 1}`}
                  className="w-22 h-28 object-cover rounded-md"
                />
              ))}
            </div>
          )}
        </div>
      </td>

      {/* ❌ Supprimer */}
      <td className="px-2 text-center rounded-r-md">
        <div className="flex items-center">
          {canDelete && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              title="Supprimer cet événement"
            >
              <svg
                className="w-6 h-6 text-red-700 hover:text-red-500 cursor-pointer transition"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                />
              </svg>
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default SafetyEventRow;
