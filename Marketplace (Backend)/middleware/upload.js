const multer = require('multer');
const path = require('path');
const fs = require('fs');

// File upload configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Navigate up one level from middleware to root, then to uploads
        const uploadDir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const fileExt = path.extname(file.originalname);
        const fileName =
            file.fieldname +
            '-' +
            Date.now() +
            '-' +
            Math.random().toString(36).substr(2, 6) +
            fileExt;
        cb(null, fileName);
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
    },
    fileFilter: function (req, file, cb) {
        // Allow all image types for preview images
        if (file.fieldname === 'image') {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            } else {
                cb(new Error('Only image files are allowed for preview images'), false);
            }
        }
        // Restrict model files to browser-editable formats only
        else if (file.fieldname === 'model') {
            const allowedExtensions = ['.glb', '.gltf', '.obj', '.stl'];
            const fileExtension = path.extname(file.originalname).toLowerCase();

            if (allowedExtensions.includes(fileExtension)) {
                cb(null, true);
            } else {
                cb(new Error(`File type ${fileExtension} not supported. Only GLB, GLTF, OBJ, and STL files are allowed for browser-based CAD editing.`), false);
            }
        }
        // Allow other fields
        else {
            cb(null, true);
        }
    },
});

module.exports = upload;
