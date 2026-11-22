const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { randomUUID } = require("crypto");
const AppError = require("../utils/AppError");

const root = path.resolve(process.cwd(), "uploads");
const folders = ["usuarios", "clientes", "veiculos", "locacoes"];
const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (!folders.includes(req.uploadFolder)) return cb(new Error("Pasta de upload inválida."));
    const dir = path.join(root, req.uploadFolder);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${randomUUID()}${ext}`);
  }
});
const uploader = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter(req, file, cb) {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) return cb(new AppError("Envie uma imagem JPEG, PNG ou WebP.", 400));
    cb(null, true);
  }
});
function imageUpload(folder) {
  if (!folders.includes(folder)) throw new Error("Pasta inválida.");
  return (req, res, next) => {
    req.uploadFolder = folder;
    uploader.single("imagem")(req, res, err => {
      if (err) return next(err instanceof AppError ? err : new AppError(err.message, 400));
      next();
    });
  };
}
module.exports = imageUpload;
