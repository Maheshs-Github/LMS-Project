import PDFDocument from "pdfkit";
import crypto from "crypto"

export const generateCertificatePdf = ({
  res,
  certificate,
  student,
  course,
  instructor,
}) => {
  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
  });

  res.setHeader("Content-Type", "application/pdf");

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${course.title}-certificate.pdf"`,
  );

  doc.pipe(res);

  // PDF content will go here

  doc.rect(20, 20, 555, 800).lineWidth(2).stroke("#1E3A8A");

  doc
    .font("Helvetica-Bold")
    .fontSize(28)
    .fillColor("#1E3A8A")
    .text("Infinity LMS", {
      align: "center",
    });

  doc.moveDown();

  doc
    .font("Helvetica-Bold")
    .fontSize(24)
    .fillColor("black")
    .text("CERTIFICATE OF COMPLETION", {
      align: "center",
    });

  doc.moveDown(2);

  doc
    .font("Helvetica")
    .fontSize(16)
    .text("This certificate is proudly presented to", {
      align: "center",
    });

  doc.moveDown();

  doc
    .font("Helvetica")
    .fontSize(16)
    .fillColor("black")
    .text(`For successfully completing the course`, {
      align: "center",
    });

  doc.moveDown();

  doc
    .font("Helvetica")
    .fontSize(15)
    .fillColor("black")
    .text(`Instructor: ${instructor}`, {
      align: "center",
    });

  doc.moveDown();

  doc.text(
    `Completed On: ${new Date(certificate.completionDate).toLocaleDateString(
      "en-IN",
    )}`,
    {
      align: "center",
    },
  );

  doc.moveDown();

  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .text(`Certificate ID: ${certificate.certificateId}`, {
      align: "center",
    });

  doc.end();
};

//
// Certificate ID function
export const generateCertificateId = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const random = crypto.randomBytes(3).toString("hex").toUpperCase();

  return `INF-${year}${month}${day}-${random}`;
};
