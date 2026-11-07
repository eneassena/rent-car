const fs = require("fs");
const path = require("path");

function removeFileByPublicPath(publicPath) {
  if (!publicPath) return;
  const relative = publicPath.replace(/^\/uploads\//, "");
  if (relative === publicPath || relative.includes("..")) return;
  const root = path.resolve(process.cwd(), "uploads");
  const target = path.resolve(root, relative);
  if (!target.startsWith(root + path.sep)) return;
  try { if (fs.existsSync(target)) fs.unlinkSync(target); } catch (err) {
    console.error("Não foi possível remover arquivo:", err.message);
  }
}
function publicImagePath(file) {
  return file ? `/uploads/${path.basename(path.dirname(file.path))}/${file.filename}` : null;
}
module.exports = { removeFileByPublicPath, publicImagePath };
