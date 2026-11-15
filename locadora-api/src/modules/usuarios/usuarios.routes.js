const router = require("express").Router();
const db = require("../../config/database");
const image = require("../../middlewares/uploadMiddleware");
const {
  publicImagePath,
  removeFileByPublicPath,
} = require("../../utils/fileUtils");
const fs = require("fs");
router.get("/me", (req, res, next) => {
  try {
    const user = db
      .prepare(
        "SELECT id,nome,email,role,ativo,imagem_path,created_at FROM usuarios WHERE id=?",
      )
      .get(req.user.id);
    res.json({ success: true, data: user });
  } catch (e) {
    next(e);
  }
});
router.put("/me/imagem", image("usuarios"), (req, res, next) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "Envie o campo imagem." });
    const old = db
      .prepare("SELECT imagem_path FROM usuarios WHERE id=?")
      .get(req.user.id);
    const path = publicImagePath(req.file);
    db.prepare(
      "UPDATE usuarios SET imagem_path=?,updated_at=CURRENT_TIMESTAMP WHERE id=?",
    ).run(path, req.user.id);
    if (old?.imagem_path) removeFileByPublicPath(old.imagem_path);
    res.json({ success: true, data: { imagem_path: path } });
  } catch (e) {
    if (req.file) fs.unlink(req.file.path, () => {});
    next(e);
  }
});
module.exports = router;
