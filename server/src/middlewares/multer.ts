// middlewares/multer.ts
import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        console.log("📎 Multer fileFilter called");
        console.log("   File:", file);

        // Accept images only
        if (!file.mimetype.startsWith('image/')) {
            console.log("❌ File rejected: not an image");
            return cb(new Error('Only image files are allowed'));
        }

        console.log("✅ File accepted");
        cb(null, true);
    }
});

// Add error handling middleware for multer
export const handleMulterError = (err: any, req: any, res: any, next: any) => {
    console.log("💥 Multer error handler called");
    console.log("   Error:", err);

    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                ok: false,
                message: 'File too large. Maximum size is 5MB'
            });
        }
        return res.status(400).json({
            ok: false,
            message: err.message
        });
    }

    if (err) {
        return res.status(400).json({
            ok: false,
            message: err.message || 'File upload error'
        });
    }

    next();
};