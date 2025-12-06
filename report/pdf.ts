import PDFDocument from "pdfkit";
import fs from "fs";

export async function generatePDFReport(result, chartBase64) {
  const doc = new PDFDocument({ margin: 50 });
  const path = `./reports/${result.id}.pdf`;
  const stream = fs.createWriteStream(path);
  doc.pipe(stream);

  doc.fontSize(20).text("OZ Retouch UI/UX Report", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Site: ${result.siteName}`);
  doc.text(`URL: ${result.url}`);
  doc.text(`Date: ${new Date(result.analysisDate).toLocaleString()}`);
  doc.moveDown();

  doc.image(chartBase64, { width: 300, align: "center" });
  doc.moveDown();

  doc.fontSize(14).text("Summary", { underline: true });
  doc.fontSize(11).text(result.summary);
  doc.moveDown();

  doc.fontSize(14).text("Issues", { underline: true });
  result.issues.forEach((issue, i) => {
    doc.fontSize(11).text(`${i + 1}. [${issue.category}] ${issue.title}`);
    doc.text(`- Severity: ${issue.severity}`);
    doc.text(`- ${issue.description}`);
    doc.text(`- 개선방안: ${issue.recommendation}`);
    doc.moveDown();
  });

  doc.end();
  await new Promise((resolve) => stream.on("finish", resolve));

  return path;
}
