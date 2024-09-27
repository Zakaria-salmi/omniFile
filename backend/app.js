const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const mammoth = require("mammoth");
const ExcelJS = require("exceljs");
const fs = require("fs");
const { PDFDocument } = require("pdf-lib");

const app = express();
const upload = multer({ dest: "uploads/" });

// Default endpoint
app.get("/", (req, res) => {
    res.send("File Conversion API");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
