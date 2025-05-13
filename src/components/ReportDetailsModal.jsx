const ReportDetailsModal = ({ report, onClose }) => {
  const normales = report.entries.filter(
    (e) => !e.out_of_tour && e.machine_tag && e.comment
  );
  const horsTour = report.entries.filter((e) => e.out_of_tour);
  const safety = report.safetyEvents || [];
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("fr-FR", {
      timeZone: "Europe/Paris",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-md animate-slide-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-[90%] max-w-2xl max-h-[90%] overflow-auto border border-gray-300 dark:border-gray-700">
        {/* 🧱 Bandeau titre avec bouton fermer */}
        <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-lg py-3 px-5 rounded-t-lg border-b border-gray-300 dark:border-gray-700 flex items-center justify-between transition-colors duration-500 ease-in-out">
          <span>Détails du rapport – {report.sector}</span>
          <button
            onClick={onClose}
            title="Fermer"
            className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-600 transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 📄 Contenu */}
        <div className="px-4 sm:px-6 py-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Date :{" "}
            <span className="text-black dark:text-white font-medium">
              {formatDate(report.date)}
            </span>
            <br />
            {report.tour && (
              <>
                Tournée :{" "}
                <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                  {report.tour}
                </span>
              </>
            )}
          </p>

          {/* 🔵 Anomalies classiques */}
          {normales.length > 0 && (
            <>
              <h4 className="text-sm font-semibold mb-2 text-blue-700 dark:text-blue-400">
                Observations / Actions
              </h4>
              <ul className="space-y-2 mb-4">
                {normales.map((e, i) => (
                  <li
                    key={i}
                    className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md border-l-4 border-blue-500"
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      🏷️ {e.machine_tag}
                    </p>
                    <p className="text-sm text-gray-800 dark:text-gray-300 mt-1">
                      💬 {e.comment}
                    </p>
                    {Array.isArray(e.images) ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {e.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`photo-${idx}`}
                            className="h-24 sm:h-28 rounded shadow-md"
                          />
                        ))}
                      </div>
                    ) : e.image ? (
                      <img
                        src={e.image}
                        alt="photo anomalie"
                        className="mt-2 max-h-40 rounded shadow-md"
                      />
                    ) : null}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* 🟡 Hors tournée */}
          {horsTour.length > 0 && (
            <>
              <h4 className="text-sm font-semibold mb-2 text-yellow-700 dark:text-yellow-500">
                Hors tournée
              </h4>
              <ul className="space-y-2 mb-4">
                {horsTour.map((e, i) => (
                  <li
                    key={i}
                    className="bg-yellow-50 dark:bg-yellow-100/10 p-2 rounded-md border-l-4 border-yellow-500"
                  >
                    <p className="text-sm font-medium text-gray-800 dark:text-yellow-300">
                      🏷️ {e.machine_tag}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      💬 {e.comment}
                    </p>
                    {Array.isArray(e.images) ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {e.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`photo-${idx}`}
                            className="h-24 sm:h-28 rounded shadow-md"
                          />
                        ))}
                      </div>
                    ) : e.image ? (
                      <img
                        src={e.image}
                        alt="photo hors tournée"
                        className="mt-2 max-h-40 rounded shadow-md"
                      />
                    ) : null}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* 🔴 Sécurité */}
          {safety.length > 0 && (
            <>
              <h4 className="text-sm font-semibold mb-2 text-red-700 dark:text-red-400">
                Sécurité
              </h4>
              <ul className="space-y-2 mb-4">
                {safety.map((e, i) => (
                  <li
                    key={i}
                    className="bg-red-50 dark:bg-red-900/30 p-2 rounded-md border-l-4 border-red-600"
                  >
                    <p className="text-sm font-medium text-red-800 dark:text-red-300">
                      🚨 {e.type}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      💬 {e.description}
                    </p>
                    {Array.isArray(e.images) ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {e.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`photo-${idx}`}
                            className="h-24 sm:h-28 rounded shadow-md"
                          />
                        ))}
                      </div>
                    ) : e.image ? (
                      <img
                        src={e.image}
                        alt="évènement sécurité"
                        className="mt-2 max-h-40 rounded shadow-md"
                      />
                    ) : null}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* 🟣 Tournée grosses machines */}
          {report.heavyEntries.length > 0 && (
            <>
              <h4 className="text-sm font-semibold mb-2 text-purple-700 dark:text-purple-400">
                Tournée grosses machines
              </h4>

              {/* 🧹 Machines avec données */}
              <ul className="space-y-2 mb-4">
                {report.heavyEntries
                  .filter(
                    (e) =>
                      e.pression ||
                      e.temperature ||
                      e.heure ||
                      e.vidange_date ||
                      e.controle_eau ||
                      e.controle_niveau_huile ||
                      e.observation
                  )
                  .map((e, i) => (
                    <li
                      key={i}
                      className="bg-purple-50 dark:bg-purple-900/30 p-2 rounded-md border-l-4 border-purple-600"
                    >
                      <p className="text-sm font-medium text-purple-900 dark:text-purple-200">
                        🏷️ {e.machine_tag}
                      </p>

                      {e.pression && (
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          💨 Pression : {e.pression} bar
                        </p>
                      )}
                      {e.temperature && (
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          🌡️ Température : {e.temperature} °C
                        </p>
                      )}
                      {e.heure && (
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          ⏰ Heure : {e.heure}
                        </p>
                      )}
                      {e.vidange_date && (
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          🛢️ Vidange des entretoises :{" "}
                          {new Date(e.vidange_date).toLocaleDateString("fr-FR")}
                        </p>
                      )}
                      {e.controle_eau && (
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          💧 Circulation d'eau : ✅
                        </p>
                      )}
                      {e.controle_niveau_huile && (
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          🛢️ Niveau huile GM : ✅
                        </p>
                      )}
                      {e.observation && (
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          💬 {e.observation}
                        </p>
                      )}
                      {Array.isArray(e.images) && e.images.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {e.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`image-${e.machine_tag || i}-${idx}`}
                              className="h-24 sm:h-28 rounded shadow-md"
                            />
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
              </ul>

              {/* 🟪 Machines avec RAS */}
              {report.heavyEntries.filter(
                (e) =>
                  !e.pression &&
                  !e.temperature &&
                  !e.heure &&
                  !e.vidange_date &&
                  !e.controle_eau &&
                  !e.controle_niveau_huile &&
                  !e.observation
              ).length > 0 && (
                <div className="mb-4 text-sm text-gray-700 dark:text-gray-300 bg-purple-100 dark:bg-purple-800/40 border-l-4 border-purple-400 rounded-md p-3">
                  ✅ Machines R.A.S. :{" "}
                  <span className="font-medium">
                    {report.heavyEntries
                      .filter(
                        (e) =>
                          !e.pression &&
                          !e.temperature &&
                          !e.heure &&
                          !e.vidange_date &&
                          !e.controle_eau &&
                          !e.controle_niveau_huile &&
                          !e.observation
                      )
                      .map((e) => e.machine_tag)
                      .join(", ")}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsModal;
