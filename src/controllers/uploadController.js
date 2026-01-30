const upload = require('../utils/fileUpload');

exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }

  // Construct URL. Ideally this should return a full URL or relative path depending on frontend needs.
  // For now return relative path that can be served via static middleware.
  // Assuming we set up generic static serve for /uploads or client handles domain.
  const filePath = `uploads/${req.file.filename}`;

  res.status(200).json({
    success: true,
    data: {
      filePath,
      filename: req.file.filename
    }
  });
};
