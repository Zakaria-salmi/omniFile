const express = require("express");
const cors = require("cors");
const multer = require("multer");
const sharp = require("sharp");
const dotenv = require("dotenv");

// const fs = require("fs-extra");
// const { PDFDocument, rgb } = require("pdf-lib");
// const { Document, Packer, Paragraph } = require("docx");
// const XLSX = require("xlsx");
// const odt2html = require("odt2html");
// const path = require("path");

dotenv.config();

const app = express();

const isDevelopment = process.env.STATUS === "development";

console.log(isDevelopment);

app.use(
    cors({
        origin: isDevelopment ? "*" : "https://omni-file-frontend.vercel.app",
    })
);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const imageFormats = [
    "GIF",
    "AVIF",
    "JPEG",
    "JPG",
    "TILE",
    "PNG",
    "RAW",
    "TIFF",
    "WEBP",
];

const documentFormats = ["PDF", "DOCX", "XLSX", "ODT", "TXT"];

app.post("/api/convert/image", upload.single("file"), async (req, res) => {
    const format = req.body.format.toUpperCase();
    const file = req.file;

    const oldFormat = file.originalname.split(".").pop().toUpperCase();

    if (!file || !format) {
        return res.status(400).send("File and format are required.");
    }

    if (imageFormats.includes(oldFormat) && imageFormats.includes(format)) {
        try {
            const convertedFile = await sharp(file.buffer)
                .toFormat(format.toLowerCase())
                .toBuffer();
            res.set({
                "Content-Type": `image/${format.toLowerCase()}`,
                "Content-Disposition": `attachment; filename=${
                    file.originalname.split(".")[0]
                }.${format.toLowerCase()}`,
            });
            return res.send(convertedFile);
        } catch (err) {
            console.error("Error converting image file:", err);
            return res.status(500).send("Error converting image file.");
        }
    } else {
        return res.status(400).send("Invalid image format.");
    }
});

app.post("/api/convert/document", upload.single("file"), async (req, res) => {
    const targetFormat = req.body.format.toUpperCase();
    const file = req.file;

    if (!file || !targetFormat) {
        return res.status(400).send("File and target format are required.");
    }

    const sourceFormat = file.originalname.split(".").pop().toUpperCase();

    if (
        !documentFormats.includes(sourceFormat) ||
        !documentFormats.includes(targetFormat)
    ) {
        return res.status(400).send("Invalid document format.");
    }

    try {
        let convertedBuffer;
        let contentType;
        let fileExtension;

        switch (targetFormat) {
            case "PDF":
                convertedBuffer = await convertToPDF(file.buffer, sourceFormat);
                contentType = "application/pdf";
                fileExtension = "pdf";
                break;
            case "DOCX":
                convertedBuffer = await convertToDOCX(
                    file.buffer,
                    sourceFormat
                );
                contentType =
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                fileExtension = "docx";
                break;
            case "XLSX":
                convertedBuffer = await convertToXLSX(
                    file.buffer,
                    sourceFormat
                );
                contentType =
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                fileExtension = "xlsx";
                break;
            case "ODT":
                convertedBuffer = await convertToODT(file.buffer, sourceFormat);
                contentType = "application/vnd.oasis.opendocument.text";
                fileExtension = "odt";
                break;
            case "TXT":
                convertedBuffer = await convertToTXT(file.buffer, sourceFormat);
                contentType = "text/plain";
                fileExtension = "txt";
                break;
            default:
                return res.status(400).send("Unsupported target format.");
        }

        res.set({
            "Content-Type": contentType,
            "Content-Disposition": `attachment; filename=${
                file.originalname.split(".")[0]
            }.${fileExtension}`,
        });
        return res.send(convertedBuffer);
    } catch (err) {
        console.error("Error converting document:", err);
        return res.status(500).send("Error converting document.");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});
