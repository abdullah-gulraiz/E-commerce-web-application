const multer = require('multer');
const { cloudinary, isConfigured } = require('../config/cloudinary');

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

// Vercel's filesystem is read-only, so files are held in memory and streamed
// straight to Cloudinary rather than written to an uploads/ folder.
const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  },
});

const uploadBuffer = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: process.env.CLOUDINARY_FOLDER || 'ecommerce/products', resource_type: 'image' },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });

// Sends each buffered file to Cloudinary and writes the hosted URL onto
// `file.path`, which is the field the product controller already reads.
const sendToCloudinary = async (req, res, next) => {
  const files = req.files || (req.file ? [req.file] : []);
  if (files.length === 0) return next();

  if (!isConfigured()) {
    return res.status(500).json({
      message:
        'Image upload is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.',
    });
  }

  try {
    await Promise.all(
      files.map(async (file) => {
        const result = await uploadBuffer(file.buffer);
        file.path = result.secure_url;
        file.publicId = result.public_id;
        delete file.buffer;
      })
    );
    next();
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    res.status(502).json({ message: 'Image upload failed. Please try again.' });
  }
};

// Usage: upload.array('image', 5) — same call signature as before.
const upload = {
  array: (field, maxCount) => [multerUpload.array(field, maxCount), sendToCloudinary],
  single: (field) => [multerUpload.single(field), sendToCloudinary],
};

module.exports = upload;
