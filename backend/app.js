const express = require("express");
const cors = require("cors");
const multer = require("multer");
const sharp = require("sharp");

const app = express();

// Activer CORS pour toutes les routes
app.use(cors());

// Configurer multer pour stocker les fichiers en mémoire (buffer)
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

app.post("/api/convert", upload.single("file"), async (req, res) => {
    const format = req.body.format;
    const file = req.file;

    const oldFormat = file.originalname.split(".").pop().toUpperCase();

    if (!file || !format) {
        return res.status(400).send("Fichier et format requis.");
    }

    if (
        !imageFormats.includes(format.toUpperCase()) ||
        !imageFormats.includes(oldFormat.toUpperCase())
    ) {
        return res.status(400).send("Format non supporté.");
    }

    try {
        // Conversion du fichier en mémoire avec sharp
        const convertedFile = await sharp(file.buffer)
            .toFormat(format)
            .toBuffer();

        // Définir les bons headers pour le fichier converti
        res.set({
            "Content-Type": `image/${format}`,
            "Content-Disposition": `attachment; filename=${file.originalname}.${format}`,
        });

        // Envoyer le fichier converti en réponse
        res.send(convertedFile);
    } catch (err) {
        console.error("Erreur lors de la conversion du fichier:", err);
        res.status(500).send("Erreur lors de la conversion du fichier.");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
