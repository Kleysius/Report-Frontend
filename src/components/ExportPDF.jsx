import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import kemOneLogo from "../assets/logokemone2.jpg";
import "../fonts/Manrope-Regular-normal.js";
import "../fonts/Manrope-Bold-bold.js";

const ExportPDF = ({ reportData }) => {
  const handleExport = async () => {
    const pdf = new jsPDF("p", "mm", "a4");

    // 🏷️ En-tête
    pdf.addImage(kemOneLogo, "JPEG", 8, 5, 60, 22.5);
    pdf.setFont("Manrope", "bold");
    pdf.setFontSize(12);
    pdf.text(`Secteur : ${reportData.sector}`, 160, 15);
    pdf.text(`Date : ${new Date().toLocaleDateString("fr-FR")}`, 160, 20);

    pdf.setFontSize(16);
    pdf.text("Rapport journalier de lubrification", 60, 35);

    pdf.setFontSize(10);
    pdf.setFont("Manrope", "bold");
    let startY;

    if (
      reportData.tour &&
      (!reportData.heavyEntries || reportData.heavyEntries.length === 0)
    ) {
      pdf.setFont("Manrope", "bold");
      pdf.setFontSize(10);
      pdf.text("Tournée du jour :", 105, 45, { align: "center" });

      pdf.setFont("Manrope", "normal");
      pdf.setFontSize(9);

      const tourText = reportData.tour;
      const maxWidth = pdf.internal.pageSize.getWidth() - 30;
      const wrappedTour = pdf.splitTextToSize(tourText, maxWidth);

      wrappedTour.forEach((line, i) => {
        pdf.text(line, 105, 50 + i * 5, { align: "center" });
      });

      startY = 50 + wrappedTour.length * 5 + 4;
    } else {
      startY = 55;
    }

    // 🧩 Séparation des entrées
    const normales = reportData.entries
      .filter((e) => !e.out_of_tour && e.machine_tag && e.comment)
      .sort((a, b) => a.machine_tag.localeCompare(b.machine_tag));
    const horsTour = reportData.entries
      .filter((e) => e.out_of_tour)
      .sort((a, b) => a.machine_tag.localeCompare(b.machine_tag));
    const safety = (reportData.safetyEvents || []).sort((a, b) => a.type.localeCompare(b.type));
    const heavy = (reportData.heavyEntries || []).sort((a, b) => a.machine_tag.localeCompare(b.machine_tag));

    // 🟦 Anomalies classiques
    if (normales.length) {
      autoTable(pdf, {
        startY,
        head: [["Machine", "Observation"]],
        body: normales.map((e) => [e.machine_tag, e.comment]),
        headStyles: { fillColor: [0, 51, 102] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        styles: {
          fontSize: 9,
          cellPadding: 2,
          lineHeight: 1.1,
          valign: "middle",
        },
        margin: { top: 1, bottom: 1 },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: "auto" },
        },
      });
      startY = pdf.lastAutoTable.finalY + 6;
    }

    if (heavy && heavy.length > 0) {
      pdf.setFont("Manrope", "bold");
      pdf.setTextColor(102, 51, 153); // violet foncé
      pdf.text("Tournée grosses machines :", 15, startY);
      startY += 2;

      // ⚙️ Filtrage uniquement des lignes avec au moins une info remplie
      const visibles = heavy.filter((e) => {
        const {
          pression,
          temperature,
          heure,
          vidange_date,
          controle_eau,
          controle_niveau_huile,
          observation,
        } = e;
        return (
          pression ||
          temperature ||
          heure ||
          vidange_date ||
          controle_eau ||
          controle_niveau_huile ||
          observation
        );
      });

      autoTable(pdf, {
        startY,
        head: [["Machine", "Mesures / Observations"]],
        body: visibles.map((e) => {
          const infos = [];

          if (e.pression) infos.push(`Pression : ${e.pression} bar`);
          if (e.temperature) infos.push(`Température : ${e.temperature} °C`);
          if (e.heure) infos.push(`Heure : ${e.heure}`);
          if (e.vidange_date) {
            const formattedDate = new Date(e.vidange_date).toLocaleDateString(
              "fr-FR"
            );
            infos.push(`Vidange : ${formattedDate}`);
          }
          if (e.controle_eau) infos.push(`Circulation eau : Ok`);
          if (e.controle_niveau_huile) infos.push(`Niveau huile GM : Ok`);
          if (e.observation) infos.push(`${e.observation}`);

          return [
            e.machine_tag,
            [
              [
                e.pression ? `Pression : ${e.pression} bar` : null,
                e.temperature ? `Température : ${e.temperature} °C` : null,
                e.heure ? `Heure : ${e.heure}` : null,
                e.vidange_date
                  ? `Vidange : ${new Date(e.vidange_date).toLocaleDateString(
                      "fr-FR"
                    )}`
                  : null,
                e.controle_eau ? `Circulation eau : OK` : null,
                e.controle_niveau_huile ? `Niveau huile GM : OK` : null,
              ]
                .filter(Boolean)
                .join("   •   "),
              e.observation ? `${e.observation}` : null,
            ]
              .filter(Boolean)
              .join("\n"),
          ];
        }),
        styles: {
          font: "Manrope",
          fontSize: 9,
          cellPadding: 2,
          lineHeight: 1.2,
          valign: "top",
        },
        headStyles: {
          fillColor: [102, 51, 153], // violet
          textColor: 255,
        },
        alternateRowStyles: { fillColor: [245, 245, 255] },
        margin: { top: 2 },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: "auto" },
        },
      });

      startY = pdf.lastAutoTable.finalY + 6;

      // 🔍 Séparation des machines RAS
      const allTags = heavy.map((e) => e.machine_tag);
      const visibleTags = visibles.map((e) => e.machine_tag);
      const rasTags = allTags.filter((tag) => !visibleTags.includes(tag)).sort();

      if (rasTags.length > 0) {
        const count = rasTags.length;
        const title = `Machines R.A.S. (${count}) :`;
        const content = rasTags.join(", ");
        const fullText = `${title} ${content}`;

        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 15;
        const maxWidth = pageWidth - 2 * margin;

        const wrappedLines = pdf.splitTextToSize(fullText, maxWidth);

        wrappedLines.forEach((line, idx) => {
          const isFirst = idx === 0;
          const y = startY + idx * 5;

          if (isFirst && line.startsWith(title)) {
            const x = margin;
            const titleWidth = pdf.getTextWidth(title + " ");

            pdf.setFont("Manrope", "bold");
            pdf.setTextColor(0, 128, 0); // vert foncé
            pdf.text(title, x, y);

            pdf.setFont("Manrope", "normal");
            pdf.text(line.slice(title.length + 1), x + titleWidth, y);
          } else {
            pdf.setFont("Manrope", "normal");
            pdf.text(line, margin, y);
          }
        });

        startY += wrappedLines.length * 5; // espacement vertical entre sections
        startY += 4; // marge fixe supplémentaire
      }
    }

    // 🟡 Observations hors tournée
    if (horsTour.length) {
      pdf.setFont("Manrope", "bold");
      pdf.setFontSize(10);
      pdf.setTextColor(180, 130, 0); // Jaune foncé/orangé
      pdf.text("Hors tournée :", 15, startY);
      pdf.setTextColor(0, 0, 0); // Réinitialiser à noir pour le reste
      startY += 2;

      autoTable(pdf, {
        startY,
        head: [["Machine", "Observation"]],
        body: horsTour.map((e) => [e.machine_tag, e.comment]),
        headStyles: { fillColor: [255, 204, 0] },
        alternateRowStyles: { fillColor: [255, 253, 230] },
        styles: {
          font: "Manrope",
          fontSize: 9,
          cellPadding: 2,
          lineHeight: 1.1,
          valign: "middle",
        },
        margin: { top: 1, bottom: 1 },
        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: "auto" },
        },
      });
      startY = pdf.lastAutoTable.finalY + 6;
    }

    // 🔴 Événements de sécurité
    if (safety.length) {
      pdf.setFont("Manrope", "bold");
      pdf.setFontSize(10);
      pdf.setTextColor(153, 0, 0); // Rouge foncé
      pdf.text("Sécurité :", 15, startY);
      pdf.setTextColor(0, 0, 0); // Réinitialiser à noir pour le reste
      startY += 2;

      autoTable(pdf, {
        startY,
        head: [["Type", "Description"]],
        body: safety.map((e) => [e.type, e.description]),
        headStyles: { fillColor: [204, 0, 0] },
        alternateRowStyles: { fillColor: [255, 240, 240] },
        styles: {
          font: "Manrope",
          fontSize: 9,
          cellPadding: 2,
          lineHeight: 1.1,
          valign: "middle",
        },
        margin: { top: 1, bottom: 1 },
        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: "auto" },
        },
      });
      startY = pdf.lastAutoTable.finalY + 6;
    }

    // 📷 Images
    const allImages = [
      ...(reportData.entries || []),
      ...(reportData.safetyEvents || []),
      ...(reportData.heavyEntries || []),
    ].flatMap((entry, i) => {
      if (Array.isArray(entry.images)) {
        return entry.images.map((img, idx) => ({
          img,
          label: entry.machine_tag || entry.type || `Photo ${i + 1}-${idx + 1}`,
        }));
      } else if (entry.image) {
        return [
          {
            img: entry.image,
            label: entry.machine_tag || entry.type || `Photo ${i + 1}`,
          },
        ];
      }
      return [];
    });

    for (let i = 0; i < allImages.length; i++) {
      const { label, img } = allImages[i];
      const image = new Image();
      image.src = img;

      await new Promise((resolve) => {
        image.onload = () => {
          pdf.addPage();
          pdf.setFontSize(10);
          pdf.text(`Photo - ${label}`, 10, 10);

          const pw = pdf.internal.pageSize.getWidth();
          const ph = pdf.internal.pageSize.getHeight();
          const margin = 15;

          const ratio = image.width / image.height;
          let w = pw - 2 * margin;
          let h = w / ratio;
          if (h > ph - 2 * margin) {
            h = ph - 2 * margin;
            w = h * ratio;
          }

          const x = (pw - w) / 2;
          const y = (ph - h) / 2;
          pdf.addImage(img, "JPEG", x, y, w, h);
          resolve();
        };
        image.onerror = () => resolve();
      });
    }

    pdf.save(
      `Rapport ${reportData.sector} ${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`
    );
  };

  return (
    <button
      onClick={handleExport}
      className="p-2 cursor-pointer"
      title="Exporter le rapport au format PDF"
    >
      <svg
        className="w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          fillRule="evenodd"
          d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2 2 2 0 0 0 2 2h12a2 2 0 0 0 2-2 2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2V4a2 2 0 0 0-2-2h-7Zm-6 9a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-1h.5a2.5 2.5 0 0 0 0-5H5Zm1.5 3H6v-1h.5a.5.5 0 0 1 0 1Zm4.5-3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1.376A2.626 2.626 0 0 0 15 15.375v-1.75A2.626 2.626 0 0 0 12.375 11H11Zm1 5v-3h.375a.626.626 0 0 1 .625.626v1.748a.625.625 0 0 1-.626.626H12Zm5-5a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-1h1a1 1 0 1 0 0-2h-1v-1h1a1 1 0 1 0 0-2h-2Z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
};

export default ExportPDF;
